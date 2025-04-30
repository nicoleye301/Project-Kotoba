import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
    Pressable,
} from 'react-native';
import {
    Button,
    Card,
    Title,
    Paragraph,
    Text,
} from 'react-native-paper';
import { MotiView } from 'moti';
import { PieChart } from 'react-native-chart-kit';
import WordCloudTreemap from "@/components/Demo Comp/WordCloudTreemap";


// get device width for the charts
const screenWidth = Dimensions.get('window').width;

const WeeklyChatReportScreen = () => {
    // pie chart for highlight
    const chartData = [
        {
            name: 'Longest Conv.',
            population: 1.5, // in hours e.g. 1.5 means 1h30min
            color: '#FF6384',
            legendFontColor: '#333',
            legendFontSize: 12,
        },
        {
            name: 'Active Day',
            population: 1, // 1 means Thursday
            color: '#36A2EB',
            legendFontColor: '#333',
            legendFontSize: 12,
        },
        {
            name: 'Milestone',
            population: 1, // new milestone unlocked
            color: '#FFCE56',
            legendFontColor: '#333',
            legendFontSize: 12,
        },
    ];

    // keyword display
    const keywords = ['happy', 'productive', 'fun', 'chatty', 'vibes'];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 500 }}
            >
                <Title style={styles.title}>Weekly Chat Report</Title>
                <Paragraph style={styles.subheading}>
                    See how your week went at a glance!
                </Paragraph>
            </MotiView>

            {/* Mood Overview Section */}
            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 200, duration: 500 }}
                style={styles.sectionContainer}
            >
                <Title style={styles.sectionTitle}>Mood Overview</Title>
                <View style={styles.moodBarContainer}>
                    <View style={[styles.moodSegment, { backgroundColor: '#FDD835', flex: 0.45 }]} />
                    <View style={[styles.moodSegment, { backgroundColor: '#90A4AE', flex: 0.35 }]} />
                    <View style={[styles.moodSegment, { backgroundColor: '#64B5F6', flex: 0.20 }]} />
                </View>
                <Text style={styles.moodLabel}>
                    😊 Happy – 45%    😐 Neutral – 35%    😢 Sad – 20%
                </Text>
                <Paragraph style={styles.comment}>
                    “Lots of good vibes this week! Keep spreading positivity”
                </Paragraph>
            </MotiView>

            {/* top 3 chat buddies section */}
            <MotiView
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 400, duration: 500 }}
                style={styles.sectionContainer}
            >
                <Title style={styles.sectionTitle}>Top 3 Chat Buddies</Title>
                <View style={styles.buddiesContainer}>
                    {/* Buddy 1 */}
                    <View style={styles.buddy}>
                        <View style={styles.avatar}>
                            <Text style={styles.initial}>M</Text>
                        </View>
                        <Text style={styles.buddyName}>Mom</Text>
                        <Text style={styles.buddyCount}>112 msgs</Text>
                    </View>
                    {/* Buddy 2 */}
                    <View style={styles.buddy}>
                        <View style={styles.avatar}>
                            <Text style={styles.initial}>J</Text>
                        </View>
                        <Text style={styles.buddyName}>Jack</Text>
                        <Text style={styles.buddyCount}>89 msgs</Text>
                    </View>
                    {/* Buddy 3 */}
                    <View style={styles.buddy}>
                        <View style={styles.avatar}>
                            <Text style={styles.initial}>C</Text>
                        </View>
                        <Text style={styles.buddyName}>Carol</Text>
                        <Text style={styles.buddyCount}>52 msgs</Text>
                    </View>
                </View>
            </MotiView>

            {/* Top Emoji Usage Section */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 600, duration: 500 }}
                style={styles.sectionContainer}
            >
                <Title style={styles.sectionTitle}>Top Emoji Usage</Title>
                <View style={styles.emojisContainer}>
                    <View style={styles.emojiItem}>
                        <Text style={styles.emoji}>😂</Text>
                        <Text style={styles.emojiCount}>150</Text>
                    </View>
                    <View style={styles.emojiItem}>
                        <Text style={styles.emoji}>🔥</Text>
                        <Text style={styles.emojiCount}>120</Text>
                    </View>
                    <View style={styles.emojiItem}>
                        <Text style={styles.emoji}>💕</Text>
                        <Text style={styles.emojiCount}>90</Text>
                    </View>
                    <View style={styles.emojiItem}>
                        <Text style={styles.emoji}>😭</Text>
                        <Text style={styles.emojiCount}>60</Text>
                    </View>
                </View>
            </MotiView>

            {/* Highlights Section*/}
            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 800, duration: 500 }}
                style={styles.sectionContainer}
            >
                <Title style={styles.sectionTitle}>Highlights</Title>
                <PieChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={150}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={styles.pieChart}
                />
            </MotiView>

            {/* Word Cloud Treemap */}
            <View style={{ width: '100%', minHeight: 300 }}>
                <Title style={styles.sectionTitle}>Top Keywords this Week</Title>
                <WordCloudTreemap />
            </View>

            {/* Share Button */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 1200, duration: 500 }}
                style={styles.ctaContainer}
            >
                <Button
                    mode="contained"
                    style={styles.ctaButton}
                    contentStyle={styles.ctaButtonContent}
                    onPress={() => {}}
                >
                    Share My Recap
                </Button>
            </MotiView>
        </ScrollView>
    );
};

export default WeeklyChatReportScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F9FBFF',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
    },
    subheading: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionContainer: {
        marginVertical: 16,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#222',
        marginBottom: 12,
    },
    // mood overview styles
    moodBarContainer: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
    },
    moodSegment: {
        height: '100%',
    },
    moodLabel: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 8,
    },
    comment: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#777',
    },
    // top chat buddies styles
    buddiesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buddy: {
        alignItems: 'center',
        width: 80,
    },
    avatar: {
        width: 60,
        height: 60,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    initial: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    buddyName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },
    buddyCount: {
        fontSize: 12,
        color: '#555',
    },
    // Emoji styles
    emojisContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    emojiItem: {
        alignItems: 'center',
        width: 60,
    },
    emoji: {
        fontSize: 32,
    },
    emojiCount: {
        fontSize: 14,
        color: '#555',
    },
    // highlights styles
    chartCard: {
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#e0f7fa',
    },
    highlightText: {
        fontSize: 14,
        color: '#222',
        marginVertical: 2,
    },
    pieChart: {
        marginVertical: 10,
    },
    // top word
    keywordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    bubble: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 6,
    },
    bubbleText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    // CTA button styles
    ctaContainer: {
        marginVertical: 24,
        width: '100%',
        alignItems: 'center',
    },
    ctaButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    ctaButtonContent: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
});
