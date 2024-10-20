"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, RotateCcw } from "lucide-react";
import { BarChart } from "./charts/bar-chart";

export default function Chart() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const handleShareUrl = () => {
    // In a real application, this would generate a shareable URL
    alert("Share URL: " + window.location.href);
  };

  const handleResetPreferences = () => {
    setDarkMode(false);
    setAutoRefresh(false);
    // In a real application, this would reset more preferences
    alert("Preferences reset");
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chart Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={handleShareUrl} variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share URL
            </Button>
            <Button onClick={handleResetPreferences} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Preferences
            </Button>
          </div>
        </header>

        <Tabs defaultValue="bar" className="mb-8">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gray-200">
                  <BarChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="line">
            <Card>
              <CardHeader>
                <CardTitle>Line Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gray-200">
                  <h1 className="text-2xl font-bold">Chart for Line</h1>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chart Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
              </div>
              <div>
                <Label htmlFor="refresh-interval">
                  Refresh Interval (seconds)
                </Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  placeholder="Enter refresh interval"
                  disabled={!autoRefresh}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
