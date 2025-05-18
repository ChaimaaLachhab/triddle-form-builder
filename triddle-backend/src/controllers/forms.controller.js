const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/fileUpload');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('slugify');
const path = require('path');

/**
 * @desc    Get all forms
 * @route   GET /api/v1/forms
 * @access  Private
 */
exports.getForms = asyncHandler(async (req, res, next) => {
  // If user is not admin, only get their forms
  const where = req.user.role !== 'ADMIN' ? { userId: req.user.id } : {};

  // Add other query params if needed
  if (req.query.status) {
    where.status = req.query.status;
  }

  // Execute query
  const forms = await prisma.form.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get form IDs
  const formIds = forms.map(f => f.id);

  // Get response counts for each form
  const responsesCounts = await prisma.response.groupBy({
    by: ['formId'],
    where: { formId: { in: formIds } },
    _count: true
  });

  // Get today's date range
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Get today's response counts for each form
  const responsesTodayCounts = await prisma.response.groupBy({
    by: ['formId'],
    where: {
      formId: { in: formIds },
      createdAt: {
        gte: startOfToday,
        lte: endOfToday
      }
    },
    _count: true
  });

  // Map counts for quick lookup
  const responsesMap = Object.fromEntries(
    responsesCounts.map(rc => [rc.formId, rc._count])
  );
  const responsesTodayMap = Object.fromEntries(
    responsesTodayCounts.map(rc => [rc.formId, rc._count])
  );

  // Get lastUpdated for each form (latest response)
  const lastResponses = await prisma.response.findMany({
    where: { formId: { in: formIds } },
    orderBy: [{ createdAt: 'desc' }],
    select: { formId: true, createdAt: true }
  });

  // Helper to format "x days ago"
  function timeAgo(date) {
    if (!date) return null;
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }

  // Map lastUpdated for each form
  const lastUpdatedMap = {};
  for (const resp of lastResponses) {
    if (!lastUpdatedMap[resp.formId]) {
      lastUpdatedMap[resp.formId] = timeAgo(resp.createdAt);
    }
  }

  res.status(200).json({
    success: true,
    count: forms.length,
    data: forms.map(form => ({
    ...form,
    lastUpdated: lastUpdatedMap[form.id] || null,
    responses: responsesMap[form.id] || 0,
    responsesToday: responsesTodayMap[form.id] || 0
  }))
  });
});

/**
 * @desc    Get single form
 * @route   GET /api/v1/forms/:id
 * @access  Private/Public (depending on form settings)
 */
exports.getForm = asyncHandler(async (req, res, next) => {
  const form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is form owner or form is published
  // Skip this check if viewing form via public URL
  if (req.baseUrl.includes('/api/v1/forms') && 
      form.userId !== req.user.id && 
      req.user.role !== 'ADMIN' && 
      form.status !== 'PUBLISHED') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this form`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: form
  });
});

/**
 * @desc    Create new form
 * @route   POST /api/v1/forms
 * @access  Private
 */
exports.createForm = asyncHandler(async (req, res, next) => {
  // Generate slug from title
  const baseSlug = slugify(req.body.title || 'untitled-form', { lower: true });
  const slug = `${baseSlug}-${uuidv4().slice(0, 8)}`;

  // Create form with user ID
  const form = await prisma.form.create({
    data: {
      ...req.body,
      userId: req.user.id,
      slug: slug,
      // Ensure fields, logicJumps, and settings are properly formatted as JSON
      fields: req.body.fields || [],
      logicJumps: req.body.logicJumps || [],
      settings: req.body.settings || {
        theme: {
          primaryColor: '#3B82F6',
          backgroundColor: '#F9FAFB',
          fontFamily: 'Inter, sans-serif'
        },
        progressBar: {
          show: true,
          type: 'bar'
        },
        submitButton: {
          text: 'Submit'
        },
        successMessage: 'Thank you for your submission!',
        showQuestionNumbers: true
      }
    }
  });

  // Construct the public URL for the form
  const protocol = req.secure ? 'https' : 'http';
  const host = req.get('host');
  const publicUrl = `${protocol}://${host}/form/${form.slug}`;

  res.status(201).json({
    success: true,
    data: {
      ...form,
      form_id: form.id,
      public_url: publicUrl
    }
  });
});

/**
 * @desc    Update form
 * @route   PUT /api/v1/forms/:id
 * @access  Private
 */
exports.updateForm = asyncHandler(async (req, res, next) => {
  let form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is form owner
  if (form.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this form`,
        403
      )
    );
  }

  // Update form
  form = await prisma.form.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.status(200).json({
    success: true,
    data: form
  });
});

/**
 * @desc    Delete form
 * @route   DELETE /api/v1/forms/:id
 * @access  Private
 */
exports.deleteForm = asyncHandler(async (req, res, next) => {
  const form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is form owner
  if (form.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this form`,
        403
      )
    );
  }

  // Delete associated responses first (cascade should handle this automatically)
  await prisma.form.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Publish form
 * @route   PUT /api/v1/forms/:id/publish
 * @access  Private
 */
exports.publishForm = asyncHandler(async (req, res, next) => {
  let form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is form owner
  if (form.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to publish this form`,
        403
      )
    );
  }

  // Update form status to published
  form = await prisma.form.update({
    where: { id: req.params.id },
    data: { status: 'PUBLISHED' }
  });

  res.status(200).json({
    success: true,
    data: form
  });
});

/**
 * @desc    Archive form
 * @route   PUT /api/v1/forms/:id/archive
 * @access  Private
 */
exports.archiveForm = asyncHandler(async (req, res, next) => {
  let form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is form owner
  if (form.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to archive this form`,
        403
      )
    );
  }

  // Update form status to archived
  form = await prisma.form.update({
    where: { id: req.params.id },
    data: { status: 'ARCHIVED' }
  });

  res.status(200).json({
    success: true,
    data: form
  });
});

/**
 * @desc    Upload field file
 * @route   POST /api/v1/forms/:id/upload
 * @access  Private/Public
 */
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const form = await prisma.form.findUnique({
    where: { id: req.params.id }
  });

  if (!form) {
    return next(
      new ErrorResponse(`Form not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the file is valid
  if (!file.mimetype) {
    return next(new ErrorResponse(`Please upload a valid file`, 400));
  }

  // Determine folder based on form ID
  const folder = `triddle/forms/${form.id}`;

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.data, folder, {
      resource_type: 'auto'
    });

    // Return the file info
    res.status(200).json({
      success: true,
      data: {
        name: result.original_filename,
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        type: result.format
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Problem with file upload: ${error.message}`, 500));
  }
});