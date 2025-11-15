import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FarmingChatbot from "@/components/FarmingChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";

const Queries = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-primary" />
            Ask Expert Questions
          </h1>
          <p className="text-muted-foreground text-lg">
            Get instant AI-powered answers to all your farming questions
          </p>
        </div>

        <FarmingChatbot />

        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">💡 Tips for Better Answers:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be specific about your crop, location, and problem</li>
            <li>Select the appropriate category for faster responses</li>
            <li>Include details like soil type, weather conditions, etc.</li>
            <li>For personalized AI responses, add Groq API key to .env file</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Queries;
