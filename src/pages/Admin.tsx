import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, MessageSquare, HelpCircle, CheckCircle, Clock } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkUser();
  }, [navigate]);

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "bg-primary" },
    { label: "Pending Queries", value: "23", icon: Clock, color: "bg-accent" },
    { label: "Resolved Queries", value: "856", icon: CheckCircle, color: "bg-secondary" },
    { label: "Active Discussions", value: "45", icon: MessageSquare, color: "bg-primary" },
  ];

  const pendingQueries = [
    {
      id: 1,
      title: "Pest control for rice crop",
      user: "Amit Patel",
      category: "Pest Control",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Soil testing recommendations",
      user: "Sunita Rao",
      category: "Soil Issues",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Drip irrigation setup guidance",
      user: "Vijay Kumar",
      category: "Irrigation",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage users, queries, and community interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Pending Queries</CardTitle>
              <CardDescription>Queries awaiting expert response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingQueries.map((query) => (
                  <div key={query.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold mb-1">{query.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {query.user}</span>
                          <span>•</span>
                          <span>{query.time}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-secondary text-white px-2 py-1 rounded">
                        {query.category}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="default">
                        Respond
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  View All Queries
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Monitor Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Services</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time Chat</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Online
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
