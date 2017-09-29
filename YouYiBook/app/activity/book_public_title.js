import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    StatusBar,
    Platform
} from 'react-native';

const BACKICON = require('../img/btn_titel_back.png');
const TITLELOG = require('../img/title_logo.png');
const FITERIMG = require('../img/btn_titel_filter.png');
export default class PublicTitle extends Component {

    constructor(props) {
        super(props);
    }

    renderIosBar() {

        if (Platform.OS === 'ios') {

            return <View style={{height: 20, backgroundColor: '#E1E7E3',}}></View>
        }

    }

    render() {
        return (
            <View>
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#E1E7E3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />

                {this.renderIosBar()}
                <View style={styles.container}>

                    <View style={styles.left_view}>

                        <TouchableOpacity onPress={() => this.props._backOnclick()}>
                            <Image style={styles.left_icon} source={this.props.leftIcon}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textview}>
                        <Image source={TITLELOG} style={{height: 32, width: 32}}/>
                        <Text style={styles.textstyle} numberOfLines={1}>{this.props.title}</Text>
                    </View>
                    <View style={styles.right_view}>
                        <TouchableOpacity onPress={() => this.props._finishOnlcik()}>

                            <Image style={{
                                marginRight: 10,
                                justifyContent: 'center',
                                width: this.props.imgWidth,
                                height: this.props.imgHeight
                            }} source={this.props.finishIcon}></Image>

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
        backgroundColor: '#E1E7E3',
        justifyContent: 'space-between'
    },
    textview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textstyle: {
        fontSize: 18,
        color: '#1FA82D',
        textAlign: 'center',
        paddingLeft: 5,
    },
    right_view: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    left_view: {
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
