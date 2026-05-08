"use client";

import { SalaryForm } from "@/components/SalaryForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Submit Your Compensation</h1>
        <p className="text-muted-foreground">
          Contribute to the community intelligence by anonymously sharing your data.
        </p>
      </div>

      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>
            All data is normalized to USD Annual Base for comparison purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalaryForm />
        </CardContent>
      </Card>
    </div>
  );
}
