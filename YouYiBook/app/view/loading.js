import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Modal,
    StyleSheet,
    Platform,

} from 'react-native';
export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_show: true
        }

    }
    onRequestClose() {


    }
    render() {

        return (
            <Modal
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
            >
                <View style={styles.loadingBox}>

                    <ActivityIndicator animating={this.state.is_show}
                        style={[styles.centering, { height: 80 }]}
                        size="large" />
                </View>
            </Modal>
        );
    }

}
const styles = StyleSheet.create({
    loadingBox: { // Loading居中
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,

    },
});