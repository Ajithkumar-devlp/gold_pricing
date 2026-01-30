from typing import List, Dict, Tuple
from datetime import datetime, timedelta
import numpy as np
from models.gold_price import GoldPrice, ProfitAnalysis, ComparisonResult

def calculate_total_cost(price: GoldPrice, weight_grams: float) -> float:
    """
    Calculate total cost including making charges and GST
    """
    base_cost = price.price_per_gram * weight_grams
    making_cost = price.making_charges * weight_grams
    subtotal = base_cost + making_cost
    gst_amount = subtotal * (price.gst / 100)
    total_cost = subtotal + gst_amount
    
    return round(total_cost, 2)

def calculate_profit(
    investment_amount: float,
    investment_price: float,
    current_price: float,
    duration_days: int
) -> ProfitAnalysis:
    """
    Calculate profit/loss analysis for gold investment
    """
    # Calculate gold quantity purchased
    gold_quantity = investment_amount / investment_price
    
    # Calculate current value
    current_value = gold_quantity * current_price
    
    # Calculate profit/loss
    profit_loss = current_value - investment_amount
    profit_percentage = (profit_loss / investment_amount) * 100
    
    return ProfitAnalysis(
        investment_amount=investment_amount,
        investment_date=(datetime.now() - timedelta(days=duration_days)).strftime("%Y-%m-%d"),
        current_value=round(current_value, 2),
        profit_loss=round(profit_loss, 2),
        profit_percentage=round(profit_percentage, 2),
        gold_quantity_grams=round(gold_quantity, 3),
        investment_price_per_gram=investment_price,
        current_price_per_gram=current_price,
        duration_days=duration_days
    )

def calculate_best_deal(prices: List[GoldPrice], weight_grams: float) -> List[ComparisonResult]:
    """
    Compare prices and rank them by total cost
    """
    results = []
    total_costs = []
    
    # Calculate total costs for all platforms
    for price in prices:
        total_cost = calculate_total_cost(price, weight_grams)
        total_costs.append(total_cost)
        
        results.append(ComparisonResult(
            platform=price.platform,
            type=price.type,
            price_per_gram=price.price_per_gram,
            making_charges=price.making_charges,
            gst=price.gst,
            total_cost=total_cost,
            features=price.features,
            rank=0,  # Will be set below
            savings_vs_highest=0  # Will be set below
        ))
    
    # Sort by total cost and assign ranks
    sorted_results = sorted(results, key=lambda x: x.total_cost)
    highest_cost = max(total_costs)
    
    for i, result in enumerate(sorted_results):
        result.rank = i + 1
        result.savings_vs_highest = round(highest_cost - result.total_cost, 2)
    
    return sorted_results

def calculate_compound_growth(
    initial_price: float,
    final_price: float,
    years: float
) -> float:
    """
    Calculate compound annual growth rate (CAGR)
    """
    if years <= 0 or initial_price <= 0:
        return 0.0
    
    cagr = ((final_price / initial_price) ** (1 / years)) - 1
    return round(cagr * 100, 2)

def calculate_volatility(prices: List[float]) -> float:
    """
    Calculate price volatility (standard deviation of returns)
    """
    if len(prices) < 2:
        return 0.0
    
    returns = []
    for i in range(1, len(prices)):
        return_rate = (prices[i] - prices[i-1]) / prices[i-1]
        returns.append(return_rate)
    
    volatility = np.std(returns) * 100  # Convert to percentage
    return round(volatility, 2)

def calculate_moving_average(prices: List[float], window: int) -> List[float]:
    """
    Calculate moving average for given window
    """
    if len(prices) < window:
        return prices
    
    moving_averages = []
    for i in range(len(prices)):
        if i < window - 1:
            moving_averages.append(prices[i])
        else:
            avg = sum(prices[i-window+1:i+1]) / window
            moving_averages.append(round(avg, 2))
    
    return moving_averages

def calculate_rsi(prices: List[float], period: int = 14) -> List[float]:
    """
    Calculate Relative Strength Index (RSI)
    """
    if len(prices) < period + 1:
        return [50.0] * len(prices)  # Neutral RSI
    
    gains = []
    losses = []
    
    # Calculate gains and losses
    for i in range(1, len(prices)):
        change = prices[i] - prices[i-1]
        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))
    
    rsi_values = []
    
    for i in range(len(gains)):
        if i < period - 1:
            rsi_values.append(50.0)  # Neutral RSI for insufficient data
        else:
            avg_gain = sum(gains[i-period+1:i+1]) / period
            avg_loss = sum(losses[i-period+1:i+1]) / period
            
            if avg_loss == 0:
                rsi = 100.0
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))
            
            rsi_values.append(round(rsi, 2))
    
    return rsi_values

def calculate_support_resistance(prices: List[float], window: int = 20) -> Tuple[float, float]:
    """
    Calculate support and resistance levels
    """
    if len(prices) < window:
        return min(prices), max(prices)
    
    recent_prices = prices[-window:]
    support = min(recent_prices)
    resistance = max(recent_prices)
    
    return round(support, 2), round(resistance, 2)

def calculate_price_momentum(prices: List[float], period: int = 10) -> float:
    """
    Calculate price momentum
    """
    if len(prices) < period + 1:
        return 0.0
    
    current_price = prices[-1]
    past_price = prices[-period-1]
    
    momentum = ((current_price - past_price) / past_price) * 100
    return round(momentum, 2)

def calculate_investment_score(
    price: GoldPrice,
    weight_grams: float,
    investment_goal: str = "balanced"
) -> float:
    """
    Calculate investment score based on various factors
    """
    base_score = 50.0
    
    # Price competitiveness (lower price = higher score)
    if price.price_per_gram < 6700:
        base_score += 20
    elif price.price_per_gram < 6800:
        base_score += 10
    elif price.price_per_gram > 6900:
        base_score -= 10
    
    # Making charges (lower = better for physical gold)
    if price.type == "physical":
        if price.making_charges < 300:
            base_score += 15
        elif price.making_charges < 500:
            base_score += 10
        elif price.making_charges > 700:
            base_score -= 15
    else:
        # Digital gold typically has no making charges
        if price.making_charges == 0:
            base_score += 15
    
    # Features bonus
    feature_bonus = len(price.features) * 2
    base_score += min(feature_bonus, 10)  # Cap at 10 points
    
    # Investment goal adjustments
    if investment_goal == "liquidity" and price.type == "digital":
        base_score += 15
    elif investment_goal == "long_term" and price.type == "physical":
        base_score += 15
    elif investment_goal == "beginner" and price.type == "digital":
        base_score += 10
    
    # Platform reliability (simplified scoring)
    reliable_platforms = ["Paytm Gold", "PhonePe Gold", "Tanishq", "HDFC Bank Gold"]
    if price.platform in reliable_platforms:
        base_score += 5
    
    return min(max(base_score, 0), 100)  # Ensure score is between 0-100

def calculate_diversification_score(selected_platforms: List[str]) -> float:
    """
    Calculate diversification score based on platform mix
    """
    if not selected_platforms:
        return 0.0
    
    digital_count = sum(1 for p in selected_platforms if "Gold" in p and any(x in p for x in ["Paytm", "PhonePe", "Google"]))
    physical_count = len(selected_platforms) - digital_count
    
    # Ideal diversification is 60% digital, 40% physical
    total = len(selected_platforms)
    digital_ratio = digital_count / total
    physical_ratio = physical_count / total
    
    ideal_digital = 0.6
    ideal_physical = 0.4
    
    # Calculate deviation from ideal
    deviation = abs(digital_ratio - ideal_digital) + abs(physical_ratio - ideal_physical)
    diversification_score = max(0, 100 - (deviation * 100))
    
    return round(diversification_score, 2)