-- Create carbon credits tracking table
CREATE TABLE public.carbon_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  calculation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  soil_organic_matter DECIMAL(5,2),
  field_size_acres DECIMAL(10,2) NOT NULL,
  credits_earned DECIMAL(10,4) NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  blockchain_tx_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.carbon_credits ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own carbon credits" 
ON public.carbon_credits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own carbon credits" 
ON public.carbon_credits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon credits" 
ON public.carbon_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create carbon credit transactions table for tokenization tracking
CREATE TABLE public.carbon_credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  credit_id UUID NOT NULL REFERENCES public.carbon_credits(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('mint', 'transfer', 'retire', 'trade')),
  from_user_id UUID,
  to_user_id UUID,
  amount DECIMAL(10,4) NOT NULL,
  price_per_credit DECIMAL(10,2),
  blockchain_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.carbon_credit_transactions ENABLE ROW LEVEL SECURITY;

-- Transactions are viewable by involved parties
CREATE POLICY "Users can view their carbon credit transactions" 
ON public.carbon_credit_transactions 
FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_carbon_credits_updated_at
BEFORE UPDATE ON public.carbon_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_carbon_credits_user_id ON public.carbon_credits(user_id);
CREATE INDEX idx_carbon_credits_calculation_date ON public.carbon_credits(calculation_date);
CREATE INDEX idx_carbon_credit_transactions_credit_id ON public.carbon_credit_transactions(credit_id);