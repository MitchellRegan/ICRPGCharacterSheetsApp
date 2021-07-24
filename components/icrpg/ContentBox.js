import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const ContentBox = props => {
    return (
        <View style={[styles.wrapper, props.style]}>
            <Image style={styles.topRight} resizeMethod={'scale'} source={require('../../assets/decals/squareBorder_topRight.png')} />
            <Image style={styles.topLeft} resizeMethod={'scale'} source={require('../../assets/decals/squareBorder_topLeft.png')} />
            <Image style={styles.bottomRight} resizeMethod={'scale'} source={require('../../assets/decals/squareBorder_bottomRight.png')} />
            <Image style={styles.bottomLeft} resizeMethod={'scale'} source={require('../../assets/decals/squareBorder_bottomLeft.png')} />
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {

    },

    topRight: {
        position: 'absolute',
        right: 0,
        top: 0,
    },

    topLeft: {
        position: 'absolute',
        left: 0,
        top: 0
    },

    bottomRight: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },

    bottomLeft: {
        position: 'absolute',
        left: 0,
        bottom: 0
    }
});

export default ContentBox;