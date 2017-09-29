import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    StatusBar
} from 'react-native';
export default class CustomButton extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: this.props.bgColor,
                    borderRadius: 5,
                    width: this.props.btnWidth,
                    height: this.props.btnHeight,
                    marginRight:10

                }}>
                    <TouchableOpacity onPress={() => this.props._BtnOnlcik()} activeOpacity={0.8}  >

                        <Text style={{
                            fontSize: this.props.textSize,
                            color: this.props.textColor,
                            textAlign: 'center',

                        }} >{this.props.btnTxt}</Text>

                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    right_view: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 30
    },
    right_icon: {
        width: 39,
        height: 30,
        marginRight: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 30,
        marginLeft: 5
    },
    left_icon: {
        width: 39,
        height: 30,
        marginLeft: 10,
        justifyContent: 'center'

    }
});
