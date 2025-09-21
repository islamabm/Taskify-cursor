import React from 'react';
import StatsCard from './StatsCard';
import { Grid } from '@mui/material';

interface StatsCardData {
    title: string;
    number: number | string;
    titleBackgroundColor: string;
}

interface StatsCardListProps {
    cards: StatsCardData[];
    // Add a callback that we can invoke when the chart card is clicked
    onChartClick?: () => void;
}

const StatsCardList: React.FC<StatsCardListProps> = ({ cards, onChartClick }) => {
    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            {cards.map((card, index) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    key={card.title}
                    // If you'd rather pass click handling directly to <StatsCard/> 
                    // you can do that too. For simplicity, we wrap the entire item in an onClick.
                    onClick={() => {
                        // If the card’s title is “Chart”, call onChartClick (if provided)
                        if (card.title === 'Chart') {
                            onChartClick?.();
                        }
                    }}
                    style={{ cursor: 'pointer' }} // so user knows it's clickable
                >
                    <StatsCard
                        key={index}
                        title={card.title}
                        number={card.number}
                        titleBackgroundColor={card.titleBackgroundColor}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsCardList;
