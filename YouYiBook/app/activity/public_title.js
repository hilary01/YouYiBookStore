import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, StatusBar,Platform } from 'react-native';
export default class PublicTitle extends Component {



    renderIosBar() {

        if (Platform.OS === 'ios') {

            return <View style={{height: 20, backgroundColor: '#E1E7E3',}}></View>
        }

    }
    render() {
        return (
            <View >
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#028CE5'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                {this.renderIosBar()}
                <View style={styles.container}>

                    <View style={styles.left_view} >

                        <TouchableOpacity onPress={() => this.props._backOnclick()} >
                            <Image style={styles.left_icon} source={this.props.left_icon}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textview}>
                        <Text style={styles.textstyle} numberOfLines={1}>{this.props.text || "标题头"}</Text>
                    </View>
                    <View style={styles.right_view} >

                        <TouchableOpacity onPress={() => this.props._searchOnlcik()} >

                            <Image style={styles.right_icon} source={this.props.icon}></Image>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        backgroundColor: '#028CE5',
    },
    textview: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    textstyle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        width: 200
    },
    right_view: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 30
    },
    right_icon: {
        width: 28,
        height: 28,
        marginRight: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 30
    },
    left_icon: {
        width: 28,
        height: 28,
        marginLeft: 10,
        justifyContent: 'center'

    }
});
