import { useUser } from "@clerk/clerk-expo";
import { useRouter, useFocusEffect } from "expo-router";
import { FlatList, RefreshControl, Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useState, useCallback, useRef } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { useGlobalNotification } from "../../context/NotificationContext";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { showConfirm, showQuickSuccess, showError } = useGlobalNotification();
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id,
    { showQuickSuccess, showError }
  );

  // refresh transaction list
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Refresh data when screen comes into focus (e.g., returning from create page)
  useFocusEffect(
    useCallback(() => {
      loadData();
      
      // Entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }, [loadData, fadeAnim, slideAnim, scaleAnim])
  );

  // FAB button animation
  const animateFAB = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDelete = (id) => {
    showConfirm(
      "Delete Transaction", 
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      () => deleteTransaction(id),
      () => {} // Cancel action - do nothing
    );
  };

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* HEADER */}
        <Animated.View style={styles.header}>

          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Animated.Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <View style={styles.welcomeContainer}>

              <Animated.Text style={styles.welcomeText}>Welcome,</Animated.Text>
              <Animated.Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Animated.Text>

            </View>

          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>

            <Animated.View style={{ transform: [{ scale: fabScale }] }}>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => {
                  animateFAB();
                  router.push("/create");
                }}
              >
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </Animated.View>
            <SignOutButton />

          </View>
        </Animated.View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

      </Animated.View>

      {/* FlatList is a performant way to render long lists in React Native. */}
      {/* it renders items lazily — only those on the screen. */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30],
                  }),
                },
              ],
            }}
          >
            <TransactionItem item={item} onDelete={handleDelete} />
          </Animated.View>
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}