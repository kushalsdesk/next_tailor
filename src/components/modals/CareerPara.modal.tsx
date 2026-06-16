"use client";

import { motion } from "framer-motion";
import { Bell, BookOpen, CreditCard, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EnhancedParagraph: React.FC = () => {
  const features = [
    {
      id: "subscription",
      icon: <Bell className="h-8 w-8 text-accent" />,
      title: "Premium Subscription",
      description: "Get exclusive industry insights, job alerts, and networking opportunities with our premium subscription.",
      details: [
        { label: "Access", value: "Lifetime" },
        { label: "Alerts", value: "Instant" }
      ]
    },
    {
      id: "career-tips",
      icon: <Lightbulb className="h-8 w-8 text-accent" />,
      title: "Career Tips & Guidance",
      description: "Access personalized career advice, portfolio reviews, and mentorship from industry professionals.",
      details: [
        { label: "Mentors", value: "10+ Experts" },
        { label: "Sessions", value: "1-on-1" }
      ]
    },
    {
      id: "sell",
      icon: <CreditCard className="h-8 w-8 text-accent" />,
      title: "Sell Your Crafts",
      description: "Turn your creativity into income! List your handmade crafts, reach a wider audience, and grow your brand effortlessly.",
      details: [
        { label: "Platform Fee", value: "0% Commission" },
        { label: "Reach", value: "Pan India" }
      ]
    },
    {
      id: "msme",
      icon: <BookOpen className="h-8 w-8 text-accent" />,
      title: "MSME Guided Loan",
      description: "Flexible financing options with easy repayment plans to help you pursue your fashion education without financial stress.",
      details: [
        { label: "Interest Rate", value: "Starting at 2.5%" },
        { label: "Tenure", value: "Up to 5 years" }
      ]
    },
  ];

  return (
    <div className="mb-20">
      <motion.p
        className="text-xl font-medium font-sans text-muted-foreground mb-12 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Start your professional journey in the fashion industry after completing
        any of our courses. The possibilities are endless! Here are our exclusive business facilities:
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="h-full"
          >
            <Card className="h-full bg-card border border-border hover:border-primary/50 transition-colors shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-primary/5 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-sans text-sm flex-1">{feature.description}</p>
                
                {feature.details && (
                  <div className="w-full mt-6 grid grid-cols-2 gap-2 text-xs border-t border-border pt-4">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="bg-secondary p-2 rounded-md">
                        <p className="font-semibold text-primary">{detail.label}</p>
                        <p className="text-muted-foreground">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedParagraph;
