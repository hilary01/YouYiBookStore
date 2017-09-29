import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    Linking
} from 'react-native';

var { height, width } = Dimensions.get('window');
import Global from '../utils/global';
const DEFAULTICON = require('../img/usercenter_head_boy.png');
const ORDER_ICON = require('../img/icon_order.png');
const COAST_ICON = require('../img/icon_consume.png');
const ICON_MORE = require('../img/icon_more.png');
const FAVROITES_ICON = require('../img/icon_favorite.png');
const ADDRESS_ICON = require('../img/icon_address.png');
const ACOUNT_ICON = require('../img/icon_coupon.png');
const MESSAGE_ICON = require('../img/icon_message.png');
import DeviceStorage from '../utils/deviceStorage';
var navigate = null;
import { toastShort } from '../utils/ToastUtil';
export default class MoreViewActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };

    }


    componentDidMount() {
        navigate = this.props.navigation;
    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _onclickBtn(flag) {
        switch (flag) {
            case '0'://给我们评价
                var url = 'market://details?id=com.sfp.store'
                Linking.openURL(url).catch(err => console.error('An error occurred', err));
                break;
            case '1'://检查版本更新
                toastShort('当前为最新版本！');
                break;
            // case '2'://取消微博授权
            //     break;
            case '3'://关于我们
                navigate('AboutView', {
                });
                break;
        }


    }
    render() {

        return (
            <View style={styles.page}>
                {/* {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)} */}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <View style={styles.main_bg}>
                    {/*给我们评价*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('0')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>给我们评价</Text>
                                    </View>
                                </View>
                                <View >
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />
                    {/*检查新版本更新*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('1')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>检查新版本更新</Text>
                                    </View>
                                </View>
                                <View >
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.main_bg}>
                    {/*取消微博授权*/}
                    {/* <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('2')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>取消微博授权</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2' }} /> */}
                    {/*关于我们*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('3')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>关于我们</Text>
                                    </View>
                                </View>
                                <View >
                                    <Image style={{ width: 14, height: 14, justifyContent: 'flex-end', marginRight: 10 }} source={ICON_MORE} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        width: width,
        backgroundColor: '#f6f6f6',
        height: height
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }, main_bg: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: width - 20



    }
});