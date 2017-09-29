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
export default class PersonViewActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            nickname: '',
            registTime: '',
            photo: ''
        };

    }


    componentDidMount() {
        navigate = this.props.navigation;
        var that = this;
        DeviceStorage.get('user_data_key', function (jsonValue) {
            if (null != jsonValue) {
                that.setState({
                    nickname: jsonValue.nickname,
                    registTime: jsonValue.reg_datetime,
                    // photo:jsonValue.

                })

            }


        });

    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    finishActivity() {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _onclickBtn(flag) {
        switch (flag) {
            case '0'://我的订单
                navigate('OrderView', {
                });

                break;
            case '1'://消费记录
                navigate('ConsumeView', {
                });
                break;
            case '2'://我的收藏
                navigate('FavoriteView', {
                });
                break;
            case '3'://收货地址
                navigate('AddressView', {
                });
                break;
            case '4'://账户管理
                navigate('UserInfoView', {
                });
                break;
            case '5'://系统消息
            navigate('MessageView', {
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
                <View style={{ backgroundColor: '#A9B6A7', alignItems: 'flex-start', width: width }}>
                    <Text style={{ padding: 10, textAlign: 'center', color: 'white' }}>您好，欢迎使用游逸书城</Text>
                </View>
                <View style={{ flexDirection: 'row', width: width, alignItems: 'center', marginTop: 10 }}>

                    <Image source={DEFAULTICON} style={{ width: 63, height: 64, marginLeft: 10 }} />
                    <View style={{ marginLeft: 10, }}>

                        <Text style={{ color: '#B6220F', fontSize: 14, }}>{this.state.nickname}</Text>
                        <Text style={{ color: '#000000', fontSize: 14, }}>注册时间:{this.state.registTime}</Text>

                    </View>

                </View>
                <View style={styles.main_bg}>
                    {/*我的订单*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('0')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={ORDER_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>我的订单</Text>
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
                    {/*消费记录*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('1')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={COAST_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>消费记录</Text>
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
                    {/*我的收藏*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('2')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={FAVROITES_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>我的收藏</Text>
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
                    {/*收货地址*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('3')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={ADDRESS_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>收货地址</Text>
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
                    {/*账户管理*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('4')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={ACOUNT_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>账户管理</Text>
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
                    {/*系统消息*/}
                    <View style={{ flexDirection: 'row', height: 45, backgroundColor: '#ffffff', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this._onclickBtn('5')} activeOpacity={0.8} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20, alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                    <Image style={{ width: 14, height: 15, justifyContent: 'flex-start', marginLeft: 10 }} source={MESSAGE_ICON} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 48 }}>
                                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 5 }}>系统消息</Text>
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