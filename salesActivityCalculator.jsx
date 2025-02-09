import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QuotaCalculator = () => {
  const [quotas, setQuotas] = useState({
    pipeBuild: 4200,
    meetingsHeld: 20,
    cwMrr: 1260,
  });

  const [rates, setRates] = useState({
    connectedToMeeting: 20,
    meetingAttendance: 80,
    meetingToMrr: 80,
    mrrToCw: 50,
    emailToMeeting: 1,
    avgDealSize: 149,
  });

  const calculateMetrics = () => {
    // Convert percentages to decimals
    const convRates = {
      connectedToMeeting: rates.connectedToMeeting / 100,
      meetingAttendance: rates.meetingAttendance / 100,
      meetingToMrr: rates.meetingToMrr / 100,
      mrrToCw: rates.mrrToCw / 100,
      emailToMeeting: rates.emailToMeeting / 100,
    };

    // Calculate backwards from CW MRR target
    const requiredMrr = quotas.cwMrr / convRates.mrrToCw;
    const requiredDeals = Math.ceil(requiredMrr / rates.avgDealSize);
    const requiredAttendedMeetings = Math.ceil(requiredDeals / convRates.meetingToMrr);
    const requiredBookedMeetings = Math.ceil(requiredAttendedMeetings / convRates.meetingAttendance);
    
    // Calculate required activities
    const requiredConnectedCalls = Math.ceil(requiredBookedMeetings / convRates.connectedToMeeting);
    const requiredEmails = Math.ceil(requiredBookedMeetings / convRates.emailToMeeting);
    
    // Daily metrics (21 working days)
    const dailyConnectedCalls = Math.ceil(requiredConnectedCalls / 21);
    const dailyEmails = Math.ceil(requiredEmails / 21);
    const dailyBookedMeetings = +(requiredBookedMeetings / 21).toFixed(2);
    
    return {
      daily: {
        connectedCalls: dailyConnectedCalls,
        emails: dailyEmails,
        bookedMeetings: dailyBookedMeetings,
      },
      daily120: {
        connectedCalls: Math.ceil(dailyConnectedCalls * 1.2),
        emails: Math.ceil(dailyEmails * 1.2),
        bookedMeetings: +(dailyBookedMeetings * 1.2).toFixed(2),
      },
      monthly: {
        deals: requiredDeals,
        attendedMeetings: requiredAttendedMeetings,
        bookedMeetings: requiredBookedMeetings,
      }
    };
  };

  const metrics = calculateMetrics();

  const handleQuotaChange = (field, value) => {
    setQuotas(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const handleRateChange = (field, value) => {
    setRates(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sales Activity Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quota Inputs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Monthly Quotas</h3>
              <div>
                <Label>Pipe Build Target ($)</Label>
                <Input 
                  type="number"
                  value={quotas.pipeBuild}
                  onChange={(e) => handleQuotaChange('pipeBuild', e.target.value)}
                />
              </div>
              <div>
                <Label>Meetings Held Target</Label>
                <Input 
                  type="number"
                  value={quotas.meetingsHeld}
                  onChange={(e) => handleQuotaChange('meetingsHeld', e.target.value)}
                />
              </div>
              <div>
                <Label>CW MRR Target ($)</Label>
                <Input 
                  type="number"
                  value={quotas.cwMrr}
                  onChange={(e) => handleQuotaChange('cwMrr', e.target.value)}
                />
              </div>
            </div>

            {/* Conversion Rate Inputs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Conversion Rates (%)</h3>
              <div>
                <Label>Connected Call to Meeting (%)</Label>
                <Input 
                  type="number"
                  value={rates.connectedToMeeting}
                  onChange={(e) => handleRateChange('connectedToMeeting', e.target.value)}
                />
              </div>
              <div>
                <Label>Meeting Attendance (%)</Label>
                <Input 
                  type="number"
                  value={rates.meetingAttendance}
                  onChange={(e) => handleRateChange('meetingAttendance', e.target.value)}
                />
              </div>
              <div>
                <Label>Meeting to MRR (%)</Label>
                <Input 
                  type="number"
                  value={rates.meetingToMrr}
                  onChange={(e) => handleRateChange('meetingToMrr', e.target.value)}
                />
              </div>
              <div>
                <Label>MRR to CW (%)</Label>
                <Input 
                  type="number"
                  value={rates.mrrToCw}
                  onChange={(e) => handleRateChange('mrrToCw', e.target.value)}
                />
              </div>
              <div>
                <Label>Email to Meeting (%)</Label>
                <Input 
                  type="number"
                  value={rates.emailToMeeting}
                  onChange={(e) => handleRateChange('emailToMeeting', e.target.value)}
                />
              </div>
              <div>
                <Label>Average Deal Size ($)</Label>
                <Input 
                  type="number"
                  value={rates.avgDealSize}
                  onChange={(e) => handleRateChange('avgDealSize', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Requirements (100%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Connected Calls: {metrics.daily.connectedCalls}</p>
              <p>Emails: {metrics.daily.emails}</p>
              <p>Booked Meetings: {metrics.daily.bookedMeetings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Requirements (120%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Connected Calls: {metrics.daily120.connectedCalls}</p>
              <p>Emails: {metrics.daily120.emails}</p>
              <p>Booked Meetings: {metrics.daily120.bookedMeetings}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Required MRR Deals: {metrics.monthly.deals}</p>
              <p>Required Attended Meetings: {metrics.monthly.attendedMeetings}</p>
              <p>Required Booked Meetings: {metrics.monthly.bookedMeetings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: '100% Target',
                    'Connected Calls': metrics.daily.connectedCalls,
                    'Booked Meetings': metrics.daily.bookedMeetings,
                  },
                  {
                    name: '120% Target',
                    'Connected Calls': metrics.daily120.connectedCalls,
                    'Booked Meetings': metrics.daily120.bookedMeetings,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Connected Calls" fill="#4f46e5" />
                <Bar dataKey="Booked Meetings" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Connected Calls',
                    value: metrics.monthly.bookedMeetings / (rates.connectedToMeeting / 100),
                    fill: '#4f46e5'
                  },
                  {
                    name: 'Booked Meetings',
                    value: metrics.monthly.bookedMeetings,
                    fill: '#06b6d4'
                  },
                  {
                    name: 'Attended Meetings',
                    value: metrics.monthly.attendedMeetings,
                    fill: '#0891b2'
                  },
                  {
                    name: 'Closed Deals',
                    value: metrics.monthly.deals,
                    fill: '#0e7490'
                  }
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quota Composition</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pipe Build', value: 50, fill: '#4f46e5' },
                    { name: 'Meetings Held', value: 30, fill: '#06b6d4' },
                    { name: 'CW MRR', value: 20, fill: '#0891b2' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}%`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotaCalculator;
