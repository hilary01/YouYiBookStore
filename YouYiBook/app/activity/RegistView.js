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
import PublicTitle from '../activity/book_public_title';
const ITEMICON = require('../img/bookstore_lead_sign.png');
const STAREICON = require('../img/import_icon.png');
import CustomBtn from '../view/CustomButton';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/register';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
import Md5 from '../utils/Md5Util';
import NetUitl from '../utils/netUitl';
import { toastShort } from '../utils/ToastUtil';
import DeviceStorage from '../utils/deviceStorage';
import Global from '../utils/global';
export default class RegistActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            passWord: '',
            okPassWord: '',
            email: '',
            phone: '',
            show: false
        };

    }

    registMethord() {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + this.state.userName);
        StringBufferUtils.append('&&password=' + this.state.passWord);
        StringBufferUtils.append('&&phone=' + this.state.phone);
        StringBufferUtils.append('&&email=' + this.state.email);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }

    submitLogin() {

        var name = this.state.userName;
        var pass = this.state.passWord;
        var okPass = this.state.okPassWord;
        var phone = this.state.phone;
        var email = this.state.email;
        if (!stringUtil.isNotEmpty(name)) {
            toastShort('请输入用户名');
            return;
        }
        if (!stringUtil.isNotEmpty(pass)) {
            toastShort('请输入密码');
            return;
        }
        if (!stringUtil.isNotEmpty(okPass) || (pass != okPass)) {
            toastShort('两次输入密码不一致');
            return;
        }
        if (!stringUtil.isNotEmpty(email)) {
            toastShort('请输入邮箱');
            return;
        }
        this.registMethord();
    }
    componentDidMount() {
    }
    /**
     * 保存用户信息
     * @param {*} value 
     */
    saveUserInfo(value) {

        DeviceStorage.save('user_info_key', value);
    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                toastShort('注册成功!');
                var user = new Object();
                user.userName = that.state.userName;
                user.password = that.state.passWord;
                that.saveUserInfo(user);
                Global.userName = that.state.userName;
                Global.password = that.state.passWord;
                that.finishActivity();
                that.setState({
                    show: false

                })

            } else {
                if (null != responseData && responseData.return_code == '1') {

                    toastShort('用户名已经注册!');
                } else if (null != responseData && responseData.return_code == '2') {

                    toastShort('邮箱已经注册!');
                } else if (null != responseData && responseData.return_code == '3') {

                    toastShort('注册失败!');
                }
                that.setState({
                    show: false
                });

            }
        })
    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    finishActivity() {
        const { navigate, goBack, state } = this.props.navigation;
        state.params.callback(Global.userName, Global.passWord);
        goBack();
    }
    _goFindPassActivity() {

        // const { navigate } = this.props.navigation;
        // navigate('publisherView', {
        //     // 跳转的时候携带一个参数去下个页面
        //     callback: (data) => {
        //         this.setState({
        //             publishName: data.publisher_name,
        //             publishId: data.publisher_id

        //         })
        //     }
        // });

    }
    onClick(flag) {
        switch (flag) {
            case '1'://登录
                this.submitLogin();
                break;
        }


    }
    render() {

        return (
            <View style={styles.page}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={null} title='注册' finishIcon={null} />
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <View style={styles.main_bg}>
                    <View style={{ flexDirection: 'row', marginTop: 10, height: 40, alignItems: 'center' }} >
                        <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                        <Text >用户名:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入用户名' placeholderTextColor='#999999' underlineColorAndroid='transparent' maxLength={20}
                            onChangeText={(userName) => this.setState({ userName })}
                            value={this.state.userName}
                        />

                    </View>

                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                        <Text >密码:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                            onChangeText={(passWord) => this.setState({ passWord })}
                            value={this.state.passWord}
                        />

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                        <Text >确认密码:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入确认密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                            onChangeText={(okPassWord) => this.setState({ okPassWord })}
                            value={this.state.okPassWord}
                        />

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                        <Text>邮件:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入邮件' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                        />

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10 }}>手机号:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入手机号' placeholderTextColor='#999999' underlineColorAndroid='transparent' maxLength={11}
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}
                        />

                    </View>
                </View>
                <View style={{ width: width, alignItems: 'center', marginTop: 20 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <CustomBtn textColor='white' textSize={14} btnTxt='注册' _BtnOnlcik={() => this.onClick('1')} bgColor='#E2320E' btnWidth={width - 80} btnHeight={30} />
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
        margin: 10,
        width: width - 20



    }
});