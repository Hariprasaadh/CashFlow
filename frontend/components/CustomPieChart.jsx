import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const CustomPieChart = ({ data }) => {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={screenWidth - 80}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          center={[0, 0]}
          hasLegend={false}   // hide default legend
          absolute={false}    // percentage instead of absolute
          chartConfig={{
            color: () => `rgba(0, 0, 0, 1)`,
            labelColor: () => `rgba(0, 0, 0, 1)`,
          }}
        />
      </View>

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => {
          const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0.0';
          return (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>
                {item.name}: ${item.amount.toFixed(2)} ({percentage}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: "auto",
  },
  legendContainer: {
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    justifyContent: "center",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default CustomPieChart;
