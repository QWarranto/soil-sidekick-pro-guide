import { useAffiliate } from '@/hooks/useAffiliate';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, TrendingUp, Copy, RefreshCw, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { loading, data, register, requestPayout, refresh } = useAffiliate();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Affiliate Program</h1>
        <p className="text-muted-foreground mb-6">Sign in to join the LeafEngines affiliate program.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  if (!data?.registered) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">🌱 Join the Affiliate Program</CardTitle>
            <CardDescription className="text-base mt-2">
              Earn <span className="font-bold text-primary">30% recurring commissions</span> on every Pro subscription you refer.
              That's <span className="font-bold">$14.70/month</span> for each active user, paid monthly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">30%</div>
                <div className="text-sm text-muted-foreground">Pro Commission</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">15%</div>
                <div className="text-sm text-muted-foreground">Enterprise Commission</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">Lifetime</div>
                <div className="text-sm text-muted-foreground">Recurring Payouts</div>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li>✅ Unique referral link & code</li>
              <li>✅ Real-time earnings dashboard</li>
              <li>✅ Monthly payouts via Stripe (min $50)</li>
              <li>✅ Lifetime commissions on referred subscriptions</li>
            </ul>
            <Button onClick={register} className="w-full" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Create My Affiliate Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, codes, referrals, payouts } = data;
  const primaryCode = codes[0];

  const copyCode = () => {
    navigator.clipboard.writeText(primaryCode.code);
    toast({ title: 'Copied!', description: 'Affiliate code copied to clipboard.' });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/?ref=${primaryCode.code}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Track your referrals, earnings, and payouts.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Referrals</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {stats.totalReferrals}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{stats.activeReferrals} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              ${stats.totalEarnings.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">${stats.pendingEarnings.toFixed(2)} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available for Payout</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              ${stats.availableForPayout.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Min $50 to withdraw</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Paid Out</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Banknote className="h-5 w-5 text-green-600" />
              ${stats.paidOut.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{payouts.filter(p => p.status === 'completed').length} payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share your code or link to earn commissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 bg-muted rounded-lg text-lg font-mono font-bold tracking-wider">
              {primaryCode.code}
            </code>
            <Button variant="outline" onClick={copyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 bg-muted rounded-lg text-sm truncate">
              {window.location.origin}/?ref={primaryCode.code}
            </code>
            <Button variant="outline" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">30% Pro</Badge>
            <Badge variant="secondary">15% Enterprise</Badge>
            <Badge variant="secondary">Lifetime Recurring</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payout Button */}
      {stats.canRequestPayout && (
        <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">You have ${stats.availableForPayout.toFixed(2)} available</p>
              <p className="text-sm text-muted-foreground">Request a payout to receive your earnings.</p>
            </div>
            <Button onClick={requestPayout} className="bg-green-600 hover:bg-green-700">
              <Banknote className="h-4 w-4 mr-2" /> Request Payout
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No referrals yet. Share your code to start earning!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant="outline">{r.subscription_tier}</Badge></TableCell>
                    <TableCell>${Number(r.subscription_amount).toFixed(2)}/mo</TableCell>
                    <TableCell className="font-medium text-green-600">
                      ${Number(r.commission_amount).toFixed(2)}/mo
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      {payouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">${Number(p.amount).toFixed(2)}</TableCell>
                    <TableCell>{p.referral_count}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
