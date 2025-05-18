"use client";
 
import * as React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { FaqAccordion } from "@/components/knowledge/FaqAccordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock FAQ data
const faqs = [
  {
    question: "Will you be adding more templates later?",
    answer: "Yes! We're constantly working on adding new templates to our library. We release new templates every month based on user feedback and industry needs."
  },
  {
    question: "Can I create custom form from scratch?",
    answer: "Absolutely! Our form builder allows you to create custom forms from scratch with our intuitive drag-and-drop interface. You have complete control over the fields, layout, and design."
  },
  {
    question: "How to remove your \"Form created using Forms Ocean\" tag?",
    answer: "To remove the branding tag from your forms, you'll need to upgrade to one of our paid plans. The Pro plan and above include the option to remove the Forms Ocean branding from all your forms."
  }
];

export default function HelpSupportPage() {
  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
          <p className="text-muted-foreground">
            Get answers to frequently asked questions or reach out for assistance
          </p>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <FaqAccordion faqs={faqs} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  Get in touch with us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>+91 9983XX7898</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>+91 9983XX7897</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a href="mailto:support@formbuilder.com" className="text-primary hover:underline">
                        support@formbuilder.com
                      </a>
                    </div>
                    <div className="flex items-center mt-2">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a href="mailto:help@formbuilder.com" className="text-primary hover:underline">
                        help@formbuilder.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Chat with our experts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="mb-4">
                    Chat with one of our experts. They can answer, guide and resolve your issues.
                  </p>
                  <Button className="w-full">
                    Start a Chat Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
