import React, { useState } from 'react';
import { useWindowDimensions, StyleSheet, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { hierarchy, treemap, HierarchyRectangularNode } from 'd3-hierarchy';
import { MotiView, AnimatePresence, useAnimationState } from 'moti';

type WordNode = {
    word: string;
    frequency: number;
    value?: number;
};

const WORDS: WordNode[] = [
    { word: 'hi', frequency: 110 },
    { word: 'okay', frequency: 95 },
    { word: 'thank you', frequency: 85 },
    { word: 'love you', frequency: 80 },
    { word: 'see you', frequency: 70 },
    { word: 'good night', frequency: 65 },
    { word: 'how are you', frequency: 60 },
    { word: 'call me', frequency: 50 },
    { word: 'miss you', frequency: 45 },
    { word: 'great job', frequency: 30 },
    { word: 'sure', frequency: 20 },
    { word: 'be safe', frequency: 15 },
];

const COLORS = [
    '#fff3b0', '#fde2e4', '#d1faff', '#fef9ef', '#e9f5db',
    '#fbc4ab', '#ffcfd2', '#a0e7e5', '#c3f0ca', '#fcd5ce',
    '#f0efeb', '#fdfcdc', '#d8f3dc', '#b8f2e6', '#ffe5ec'
];

export default function WordCloudTreemap() {
    const { width } = useWindowDimensions();
    const height = 300;
    const [tooltip, setTooltip] = useState<{ x: number; y: number; word: string; freq: number } | null>(null);

    const childrenWithValue = WORDS.map((w) => ({
        ...w,
        value: w.frequency * Math.max(1, w.word.length * 0.6),
    }));

    const root = hierarchy({ name: 'root', children: childrenWithValue })
        .sum((d) => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

    const layout = treemap<WordNode>()
        .size([width - 40, height])
        .paddingInner(6)
        .paddingOuter(8);

    const nodes = layout(root).leaves();

    return (
        <View style={{ position: 'relative' }}>
            <Svg width={width - 20} height={height}>
                {nodes.map((node, i) => {
                    const x = node.x0;
                    const y = node.y0;
                    const w = node.x1 - node.x0;
                    const h = node.y1 - node.y0;
                    const word = node.data.word;
                    const freq = node.data.frequency;
                    const fontSize = Math.min(w / word.length * 1.8, h * 0.6);
                    const color = COLORS[i % COLORS.length];

                    return (
                        <MotiView
                            key={i}
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 50, type: 'timing', duration: 400 }}
                            style={[StyleSheet.absoluteFillObject, { top: y, left: x, width: w, height: h }]}
                        >
                            <MotiView
                                from={{ shadowOpacity: 0 }}
                                animate={{ shadowOpacity: 0.2 }}
                                transition={{ type: 'timing', duration: 200 }}
                                onTouchStart={() => {
                                    setTooltip({ x: x + w / 2, y: y, word, freq });
                                }}
                                onTouchEnd={() => {
                                    setTimeout(() => setTooltip(null), 1500);
                                }}
                                style={{
                                    flex: 1,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowRadius: 6,
                                    backgroundColor: color,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Svg width={w} height={h}>
                                    <SvgText
                                        x={w / 2}
                                        y={h / 2 + fontSize * 0.3}
                                        fontSize={fontSize}
                                        fill="#111"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {word}
                                    </SvgText>
                                </Svg>
                            </MotiView>
                        </MotiView>
                    );
                })}
            </Svg>

            {/* Tooltip */}
            <AnimatePresence>
                {tooltip && (
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: tooltip.y - 40,
                            left: tooltip.x - 60,
                            backgroundColor: 'white',
                            padding: 8,
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOpacity: 0.15,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 5,
                            borderWidth: 1,
                            borderColor: '#ddd',
                            width: 120,
                            alignItems: 'center',
                        }}
                    >
                        <SvgText fill="#333" fontSize="14" fontWeight="bold">
                            {tooltip.word}
                        </SvgText>
                        <SvgText fill="#777" fontSize="12">
                            {tooltip.freq} uses
                        </SvgText>
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    );
}
