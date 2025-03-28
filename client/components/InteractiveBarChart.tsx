import React, { useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, { Rect, Text, G } from "react-native-svg";
import { TouchableWithoutFeedback } from "react-native";

export interface OneToOneFrequency {
    friendName: string;
    count: number;
}

interface InteractiveBarChartProps {
    data: OneToOneFrequency[];
    width?: number;
    height?: number;
}

const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({
                                                                     data,
                                                                     width,
                                                                     height,
                                                                 }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const chartWidth = width || Dimensions.get("window").width - 40;
    const chartHeight = height || 220;

    // define chart margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const usableWidth = chartWidth - margin.left - margin.right;
    const usableHeight = chartHeight - margin.top - margin.bottom;

    // calculate bar width and spacing - 60 for bar, 40 for gap
    const numBars = data.length;
    const totalBarSpace = usableWidth / numBars;
    const barWidth = totalBarSpace * 0.6;
    const barSpacing = totalBarSpace * 0.4;

    // yScale - maps data value to  pixel value
    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const yScale = (value: number) => usableHeight * (1 - value / maxCount);

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                {data.map((d, index) => {
                    const x =
                        margin.left + index * (barWidth + barSpacing) + barSpacing / 2;
                    const barHeight = usableHeight - yScale(d.count);
                    const y = margin.top + yScale(d.count);
                    const fillColor = selectedIndex === index ? "#6750A4" : "#B0A1D3";
                    return (
                        <TouchableWithoutFeedback
                            key={`bar-${index}`}
                            onPress={() => setSelectedIndex(index)}
                        >
                            <G>
                                <Rect x={x} y={y} width={barWidth} height={barHeight} fill={fillColor} />
                                {/* Label at the bottom */}
                                <Text
                                    x={x + barWidth / 2}
                                    y={chartHeight - 5}
                                    fontSize={10}
                                    fill="#000"
                                    textAnchor="middle"
                                >
                                    {d.friendName}
                                </Text>
                                {/* if selected, show the count above the bar */}
                                {selectedIndex === index && (
                                    <Text
                                        x={x + barWidth / 2}
                                        y={y - 5}
                                        fontSize={12}
                                        fill="#000"
                                        textAnchor="middle"
                                    >
                                        {d.count}
                                    </Text>
                                )}
                            </G>
                        </TouchableWithoutFeedback>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: "center",
    },
});

export default InteractiveBarChart;
