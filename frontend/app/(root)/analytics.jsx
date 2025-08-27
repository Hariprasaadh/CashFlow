import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useTransactions } from '../../hooks/useTransactions';
import { useGlobalNotification } from '../../context/NotificationContext';
import { useFocusEffect } from 'expo-router';
import { SignOutButton } from '../../components/SignOutButton';
import PageLoader from '../../components/PageLoader';
import CustomPieChart from '../../components/CustomPieChart';
import { styles } from '../../assets/styles/analytics.styles';

const AnalyticsScreen = () => {
  const { user } = useUser();
  const { showError } = useGlobalNotification();
  const { transactions, isLoading, loadData } = useTransactions(user?.id, { showError });
  
  const [timeFrame, setTimeFrame] = useState('month'); // 'week', 'month', 'year'
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // Debug: Log what we get from useTransactions
  console.log('Analytics - useTransactions result:');
  console.log('  transactions:', transactions);
  console.log('  isLoading:', isLoading);
  console.log('  transactions length:', transactions ? transactions.length : 'null');
  
  if (transactions && transactions.length > 0) {
    console.log('  first transaction:', transactions[0]);
  }
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        loadData();
      }
    }, [user?.id, loadData])
  );

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Process transactions for analytics
  useEffect(() => {
    console.log('Transactions received:', transactions); // Debug log
    if (transactions && transactions.length > 0) {
      // For debugging, let's show ALL transactions first (remove date filtering temporarily)
      console.log('All transactions:', transactions);
      
      // Use all transactions for now to debug
      const filtered = transactions;
      
      console.log('Filtered transactions:', filtered); // Debug log
      setFilteredTransactions(filtered);
    } else {
      // Reset data when no transactions
      setFilteredTransactions([]);
    }
  }, [transactions, timeFrame]);

  const getTimeFrameStats = () => {
    console.log('Getting stats for filteredTransactions:', filteredTransactions); // Debug log
    
    if (!filteredTransactions || filteredTransactions.length === 0) {
      console.log('No filtered transactions, returning default stats');
      return { totalExpenses: 0, totalIncome: 0, transactionCount: 0 };
    }
    
    try {
      // Convert amount to number and filter
      const expenses = filteredTransactions.filter(t => {
        const amount = parseFloat(t?.amount) || 0;
        return t && !isNaN(amount) && amount < 0;
      });
      
      const income = filteredTransactions.filter(t => {
        const amount = parseFloat(t?.amount) || 0;
        return t && !isNaN(amount) && amount > 0;
      });
      
      console.log('Expense transactions:', expenses);
      console.log('Income transactions:', income);
      
      const totalExpenses = expenses.reduce((sum, t) => {
        const amount = parseFloat(t.amount) || 0;
        return sum + Math.abs(amount);
      }, 0) || 0;
      
      const totalIncome = income.reduce((sum, t) => {
        const amount = parseFloat(t.amount) || 0;
        return sum + amount;
      }, 0) || 0;
      
      const transactionCount = filteredTransactions.length || 0;

      console.log('Calculated stats:', { totalExpenses, totalIncome, transactionCount });

      return { 
        totalExpenses: Number(totalExpenses) || 0, 
        totalIncome: Number(totalIncome) || 0, 
        transactionCount: Number(transactionCount) || 0 
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return { totalExpenses: 0, totalIncome: 0, transactionCount: 0 };
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading analytics..." type="coffee" />;
  }

  const defaultStats = { totalExpenses: 0, totalIncome: 0, transactionCount: 0 };
  const stats = getTimeFrameStats() || defaultStats;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Your spending insights</Text>
        </View>
        <SignOutButton />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Frame Selector */}
        <Animated.View 
          style={[
            styles.timeFrameContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {['week', 'month', 'year'].map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[
                styles.timeFrameButton,
                timeFrame === frame && styles.timeFrameButtonActive
              ]}
              onPress={() => setTimeFrame(frame)}
            >
              <Text 
                style={[
                  styles.timeFrameText,
                  timeFrame === frame && styles.timeFrameTextActive
                ]}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <Ionicons name="trending-down" size={24} color="#FF6B6B" />
            <Text style={styles.statValue}>${Number(stats?.totalExpenses || 0).toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#4ECDC4" />
            <Text style={styles.statValue}>${Number(stats?.totalIncome || 0).toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Income</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="swap-horizontal" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{Number(stats?.transactionCount || 0)}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </Animated.View>

        {/* Single Income vs Expenses Pie Chart */}
        <Animated.View 
          style={[
            styles.chartContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.chartTitle}>
            <Ionicons name="pie-chart" size={18} color={COLORS.primary} /> Income vs Expenses
          </Text>
          {stats.totalIncome > 0 || stats.totalExpenses > 0 ? (
            <CustomPieChart
              data={[
                {
                  name: "Income",
                  amount: stats.totalIncome,
                  color: "#4CAF50", // Green
                },
                {
                  name: "Expenses", 
                  amount: stats.totalExpenses,
                  color: "#F44336", // Red
                }
              ]}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="analytics-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.noDataText}>No transactions found for {timeFrame}</Text>
            </View>
          )}
        </Animated.View>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Ionicons name="analytics-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptyMessage}>
              Start tracking your transactions to see analytics for the selected time period.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
