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
const ITEMICON = require('../img/bookstore_lead_sign.png');
const FINISHICON = require('../img/btn_title_findpwd.png');
import CustomBtn from '../view/CustomButton';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/login';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
import Md5 from '../utils/Md5Util';
import NetUitl from '../utils/netUitl';
import { toastShort } from '../utils/ToastUtil';
import DeviceStorage from '../utils/deviceStorage';
import Global from '../utils/global';
const BACKICON = require('../img/menu_btn.png');
export default class CenterLoginActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    static propTypes = {
        _changeRightIcon: React.PropTypes.func.isRequired,
        _changeView: React.PropTypes.func.isRequired,
    };// 注意这里有分号
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            passWord: '',
            show: false
        };

    }

    loginMethord(username, password) {
        this.setState({
            show: true
        });
        var pass = Md5.hex_md5(password);
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + username);
        StringBufferUtils.append('&&password=' + pass);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }

    submitLogin() {

        var name = this.state.userName;
        var pass = this.state.passWord;
        if (!stringUtil.isNotEmpty(name)) {
            toastShort('请输入用户名');
            return;
        }
        if (!stringUtil.isNotEmpty(pass)) {
            toastShort('请输入密码');
            return;
        }
        this.loginMethord(name, pass);
    }
    componentDidMount() {
        var that = this;
        DeviceStorage.get('user_info_key', function (jsonValue) {
            if (null != jsonValue) {

                that.setState({
                    userName: jsonValue.userName,
                    passWord: jsonValue.passWord

                })

            }


        });

    }
    // 存储用户数据
    saveUserData(value) {
        //appHotSearchTagList就是当时保存的时候所保存的key，而tags就是保存的值
        DeviceStorage.save('user_data_key', value);


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
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                if (that.props._changeRightIcon());
                toastShort('登录成功');
                that.saveUserData(responseData);
                var user = new Object();
                user.userName = responseData.username;
                user.passWord = that.state.passWord;
                that.saveUserInfo(user);
                Global.isLogin = true;
                Global.userName = responseData.username;
                Global.passWord = that.state.passWord;
                that.props._changeView();
                that.setState({
                    show: false

                })

            } else {
                toastShort('登录失败');
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
        // const { goBack } = this.props.navigation;
        // goBack();
        alert('显示个人资料');
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
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <View style={{ backgroundColor: '#A9B6A7', alignItems: 'flex-start', width: width }}>
                    <Text style={{ padding: 10, textAlign: 'center', color: 'white' }}>您好，欢迎使用游逸书城</Text>
                </View>
                <View style={styles.main_bg}>
                    <View style={{ flexDirection: 'row', marginTop: 10, height: 40, alignItems: 'center' }} >
                        <Text style={{ marginLeft: 10 }}>用户名:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入用户名' placeholderTextColor='#999999' underlineColorAndroid='transparent' maxLength={20}
                            onChangeText={(userName) => this.setState({ userName })}
                            value={this.state.userName}
                        />

                    </View>
                    <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10 }}>    密码:</Text>
                        <TextInput
                            style={{ width: width - 80, height: 36, backgroundColor: 'white' }}
                            placeholder='请输入密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                            onChangeText={(passWord) => this.setState({ passWord })}
                            value={this.state.passWord}
                        />

                    </View>
                </View>
                <View style={{ width: width, alignItems: 'center', marginTop: 20 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:10 }}>

                        <CustomBtn textColor='white' textSize={14} btnTxt='登录' _BtnOnlcik={() => this.onClick('1')} bgColor='#E2320E' btnWidth={width - 40} btnHeight={30} />
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