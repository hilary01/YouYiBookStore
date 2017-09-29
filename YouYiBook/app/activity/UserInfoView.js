import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    Image,
    InteractionManager,
    FlatList,
    Dimensions,
    TextInput,
    ScrollView

} from 'react-native';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';
var { height, width } = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';
var BASEURL = '';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
import { CachedImage } from "react-native-img-cache";
import { toastShort } from '../utils/ToastUtil';
const BACKICON = require('../img/btn_titel_back.png');
import CustomBtn from '../view/CustomButton';
const DEFAULTICON = require('../img/usercenter_head_boy.png');
import PublicTitle from '../activity/book_public_title';
var addressEntity = null;
import CityPicker from '../view/city_picker';
import stringUtil from '../utils/StringUtil';
const ICON_MORE = require('../img/icon_more.png');
var RADIO_NORMAL = require('../img/icon_normal.png');
var RADIO_AGREE = require('../img/icon_select.png');
var type = '0';
var menus = ['基本资料', '修改密码'];
const BOTTOMICON = require('../img/tab_menu_selected.png');
const LABLENOICON = require('../img/null_image.png');
import DeviceStorage from '../utils/deviceStorage';
var UPLOAD_URL = 'http://121.42.238.246:8080/unitrip_bookstore/user/fileUpload';
//图片选择器
var ImagePicker = require('react-native-image-picker');
import Md5 from '../utils/Md5Util';
//图片选择器参数设置
var options = {
    title: '请选择图片来源',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    // customButtons: [
    //     { name: 'hangge', title: 'hangge.com图片' },
    // ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class UserInfoActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            nickName: '',
            realName: '',
            sfzNum: '',
            age: '',
            phone: '',
            email: '',
            company: '',
            menuList: [],
            selectedIndex: '0',
            registTime: '',
            showInfo: true,
            userInfoEntity: null,
            show_img: '',
            tabIndex: 0,
            oldPass: '',
            newPass: '',
            okPass: ''
        };
    }

    componentDidMount() {
        this.initMenu();
        var that = this;
        this.setState({
            show: true
        })
        DeviceStorage.get('user_data_key', function (jsonValue) {
            if (null != jsonValue) {

                that.setState({
                    userInfoEntity: jsonValue
                })
                that.fillView();

            } else {
                that.setState({
                    show: false
                })
            }


        });


    }
    /**
   * 获取文件后缀名
   * @param {*} fileName 
   */
    getFileType(fileName) {
        var type = fileName.substring(fileName.lastIndexOf('.') + 1);
        return type;
    }
    //选择照片按钮点击
    choosePic() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('用户取消了选择！');
            }
            else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                let source = { path: response.path };
                // alert(source.path);
                var path = 'file://' + source.path;
                var startTime = new Date().getTime();
                this.uploadImage(UPLOAD_URL, path, startTime + '.' + this.getFileType(path));
            }

        });
    }
    /**
  * 上传图片
  * @param {*} url 
  * @param {*} path 
  * @param {*} name 
  */
    uploadImage(url, path, name) {
        var that = this;
        this.setState({
            show: true

        })
        NetUitl.uploadImage(url, path, name, function (set) {
            //下面的就是请求来的数据
            alert(JSON.stringify(set));
            if (null != set && null != set.return_code && set.return_code == '0') {
                that.setState({

                    show_img: set.result.filepath,
                    show: false

                })

                toastShort('上传头像成功！');
            } else {
                toastShort('上传头像失败！');
                that.setState({
                    show: false
                });

            }

        })


    }
    /**
* 初始化排序
* 
*/
    initMenu() {
        var topMenu = [];
        for (var i = 0; i < menus.length; i++) {
            var obj = new Object();
            obj.name = menus[i];
            obj.id = i;
            if (i == 0) {

                obj.select = true;
            } else {

                obj.select = false;
            }
            topMenu.push(obj);

        }
        this.setState({

            menuList: topMenu
        })


    }
    _menuClickListener(item, j) {
        var menu_list = this.state.menuList;
        for (var i = 0; i < menu_list.length; i++) {
            menu_list[i].select = false;

        }
        menu_list[j].select = true;
        var is_show = j == 0 ? true : false;
        this.setState({
            menuList: menu_list,
            showInfo: is_show,
            tabIndex: j

        })


    }

    renderMenuseItem(item, i) {
        return <View >
            <TouchableOpacity onPress={() => this._menuClickListener(item, i)}>
                {this._getSelectText(i, item)}
            </TouchableOpacity>

        </View>;
    }

    _getSelectText(i, item) {
        if (i == 0) {
            return <View >
                <View style={{ height: 40, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={i == 0 ? styles.leftSelectBtn : styles.leftUnSelectBtn} >
                            <Text style={item.select == true ? styles.select_txt : styles.unselect_txt} >{item.name}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ height: 8, width: width / 3 - 40 }} source={item.select == true ? BOTTOMICON : LABLENOICON} />
                        </View>
                        {this._renderEleLine(item)}
                    </View>
                    <View style={{ width: 2, backgroundColor: '#f3f3f3', height: 38, marginLeft: 1 }}></View>
                </View>
            </View>
        } else {
            return <View >
                <View style={{ height: 40, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={i == 0 ? styles.leftSelectBtn : styles.leftUnSelectBtn} >
                            <Text style={item.select == true ? styles.select_txt : styles.unselect_txt} >{item.name}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ height: 8, width: width / 3 - 40 }} source={item.select == true ? BOTTOMICON : LABLENOICON} />
                        </View>
                        {this._renderParperLine(item)}
                    </View>
                </View>
            </View>
        }


    }
    _renderEleLine(item) {
        if (item.type == '0' || item.type == '2') {

            return <View style={{ width: width / 2, backgroundColor: '#1CA831', height: 2 }} />
        } else {
            return <View style={{ width: width / 2, backgroundColor: '#e2e2e2', height: 2 }} />

        }
    }

    _renderParperLine(item) {

        if (item.type == '1' || item.type == '2') {

            return <View style={{ width: width / 2, backgroundColor: '#1CA831', height: 2 }} />
        } else {
            return <View style={{ width: width / 2, backgroundColor: '#e2e2e2', height: 2 }} />

        }
    }
    fillView() {

        var userInfos = this.state.userInfoEntity;
        if (null != userInfos) {
            var sex = userInfos.sex == '男' ? '0' : '1';
            this.setState({
                nickName: userInfos.nickname,
                realName: userInfos.realname,
                sfzNum: userInfos.idcard,
                age: userInfos.age,
                phone: userInfos.phone,
                email: userInfos.email,
                company: userInfos.company,
                selectedIndex: sex,
                registTime: userInfos.reg_datetime,
                show: false
            })
        }

    }
    componentWillUnmount() {
    }

    saveData(userInfo, type) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        if (type == '0') {
            BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/change_user_info';
            StringBufferUtils.append('username=' + Global.userName);
            StringBufferUtils.append('&&type=' + 'android');
            StringBufferUtils.append('&&phone=' + userInfo.phone);
            StringBufferUtils.append('&&realname=' + userInfo.realname);
            StringBufferUtils.append('&&nickname=' + userInfo.nickname);
            StringBufferUtils.append('&&sex=' + userInfo.sex);
            StringBufferUtils.append('&&email=' + userInfo.email);
            StringBufferUtils.append('&&idcard=' + userInfo.idcard);
            StringBufferUtils.append('&&age=' + userInfo.age);
            StringBufferUtils.append('&&company=' + userInfo.company);
        } else {
            BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/change_user_pass'
            StringBufferUtils.append('username=' + Global.userName);
            StringBufferUtils.append('&&type=' + 'android');
            StringBufferUtils.append('&&password=' + userInfo.password);
            StringBufferUtils.append('&&newpassword=' + userInfo.newpassword);
        }


        let params = StringBufferUtils.toString();
        this.fetchData(params, type, userInfo);
    }
    // 数据请求
    fetchData(params, type, userInfo) {
        const { navigate, goBack, state } = this.props.navigation;
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            console.log(responseData);
            if (null != responseData && responseData.return_code == '0') {
                if (type == '0') {
                    var userInfos = that.state.userInfoEntity;
                    userInfos.username = Global.userName;
                    userInfos.nickname = userInfo.nickname;
                    userInfos.realname = userInfo.realname;
                    userInfos.idcard = userInfo.idcard;
                    userInfos.age = userInfo.age;
                    userInfos.phone = userInfo.phone;
                    userInfos.email = userInfo.email;
                    userInfos.company = userInfo.company;
                    userInfos.sex = userInfo.sex;
                    DeviceStorage.save('user_data_key', userInfos);
                }
                toastShort('保存成功！');
                that.setState({
                    show: false
                })

                goBack();

            } else {
                toastShort('保存失败！');
                that.setState({
                    show: false
                });

            }
        })
    }
    submitSave() {

        var realName = this.state.realName;
        var nickName = this.state.nickName;
        var sfzNum = this.state.sfzNum;
        var age = this.state.age;
        var phone = this.state.phone;
        var email = this.state.email;
        var company = this.state.company;

        if (!stringUtil.isNotEmpty(nickName)) {
            toastShort('请输入昵称');
            return;
        }
        if (!stringUtil.isNotEmpty(realName)) {
            toastShort('请输入真实姓名');
            return;
        }
        if (!stringUtil.isNotEmpty(sfzNum)) {
            toastShort('请输入身份证号');
            return;
        }
        if (!stringUtil.isNotEmpty(age)) {
            toastShort('请输入年龄');
            return;
        }
        if (!stringUtil.isNotEmpty(phone)) {
            toastShort('请输入电话号码');
            return;
        }
        if (!stringUtil.isNotEmpty(email)) {
            toastShort('请输入邮箱地址');
            return;
        }
        if (!stringUtil.isNotEmpty(company)) {
            toastShort('请输入公司名称');
            return;
        }
        var sexTxt = this.state.selectedIndex == '0' ? '男' : '女';
        var obj = new Object();
        obj.realname = this.state.realName;
        obj.phone = this.state.phone;
        obj.nickname = this.state.nickName;
        obj.sex = sexTxt;
        obj.email = this.state.email;
        obj.idcard = this.state.sfzNum;
        obj.age = this.state.age;
        obj.company = this.state.company;
        this.saveData(obj, '0');
    }

    submitPassSave() {//更改密码

        var oldP = this.state.oldPass;
        var newP = this.state.newPass;
        var okP = this.state.okPass;

        if (!stringUtil.isNotEmpty(oldP)) {
            toastShort('请输入旧密码');
            return;
        }
        if (!stringUtil.isNotEmpty(newP)) {
            toastShort('请输入新密码');
            return;
        }
        if (!stringUtil.isNotEmpty(newP) || !stringUtil.isNotEmpty(okP) || newP != okP) {
            toastShort('两次输入密码不一致');
            return;
        }
        var pass = Md5.hex_md5(this.state.oldPass);
        var obj = new Object();
        obj.password = pass;
        obj.newpassword = this.state.newPass;
        this.saveData(obj, '1');
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }

    //此函数用于为给定的item生成一个不重复的key
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    finishOnlcik = () => {
        if (this.state.tabIndex == 0) {//保存用户信息
            this.submitSave();

        } else {//修改密码
            this.submitPassSave();
        }

    }
    /**
        * 选择发表状态
        * @param {*} state 
        */
    _changeRadioBtn(state) {
        if (state == '0') {

            this.setState({
                selectedIndex: state,
            })
        } else {
            this.setState({
                selectedIndex: state,
            })

        }
    }
    /**
    * 封装radioButton
    */
    _radioButton() {


        return <View style={{ flexDirection: 'row', alignItems: 'center', width: width - 80, height: 40,paddingTop:10 }}>
            <TouchableOpacity onPress={() => this._changeRadioBtn('0')} >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '0' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>男</Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._changeRadioBtn('1')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, padding: 5 }}>
                    <Image style={{ width: 16, height: 16 }} source={this.state.selectedIndex == '1' ? RADIO_AGREE : RADIO_NORMAL} />
                    <Text style={{ marginLeft: 2 }}>女</Text>

                </View>
            </TouchableOpacity>

        </View>

    }
    _renderInfo() {

        if (this.state.showInfo == true) {
            return <View>
                <View style={styles.main_bg}>
                    <TouchableOpacity onPress={() => this.choosePic()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>  头像:</Text>

                            <Image source={this.state.show_img != '' ? this.state.show_img : DEFAULTICON} style={{ width: 48, height: 48, margin: 5 }} />

                            <View style={{ width: width - 130, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.main_bg}>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>昵称:</Text>
                            <TextInput
                                style={{ width: width - 90, height: 40, backgroundColor: 'white', paddingTop: 10}}
                                placeholder='请输入昵称' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(nickName) => this.setState({ nickName })}
                                value={this.state.nickName}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
                        <Text style={styles.news_item_title}>用户名:</Text>
                        <Text style={{ width: width - 90, paddingTop: 15, paddingLeft: 5, paddingBottom: 8 }}>{Global.userName}</Text>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>真实姓名:</Text>
                            <TextInput
                                style={{ width: width - 120, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入真实姓名' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(realName) => this.setState({ realName })}
                                value={this.state.realName}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>身份证号:</Text>
                            <TextInput
                                style={{ width: width - 120, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入身份证号' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(sfzNum) => this.setState({ sfzNum })}
                                value={this.state.sfzNum}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>年龄:</Text>
                            <TextInput
                                style={{ width: width - 90, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入年龄' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(age) => this.setState({ age })}
                                value={this.state.age}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>性别:</Text>
                            {this._radioButton()}
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>手机号:</Text>
                            <TextInput
                                style={{ width: width - 120, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入手机号' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(phone) => this.setState({ phone })} maxLength={11}
                                value={this.state.phone}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>邮件:</Text>
                            <TextInput
                                style={{ width:width - 90, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入邮箱地址' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>公司:</Text>
                            <TextInput
                                style={{ width: width - 90, height: 40, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入公司名称' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(company) => this.setState({ company })}
                                value={this.state.company}
                            />
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.news_item_title}>注册时间:</Text>
                            <Text style={{ width: width - 120, paddingTop: 15, paddingLeft: 5, paddingBottom: 8 }}>{this.state.registTime}</Text>
                            {/* <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 10 }}>
                        <Image style={{ width: 14, height: 14, marginRight: 10 }} source={ICON_MORE} />
                    </View> */}
                        </View>
                    </View>

                </View>
            </View>

        } else {
            return <View style={styles.main_bg}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 10 }}>旧密码:</Text>
                    <TextInput
                        style={{ width: width -120, height: 36, backgroundColor: 'white' }}
                        placeholder='请输入旧密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                        onChangeText={(oldPass) => this.setState({ oldPass })}
                        value={this.state.oldPass}
                    />
                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 10 }}>新密码:</Text>
                    <TextInput
                        style={{ width: width - 120, height: 36, backgroundColor: 'white' }}
                        placeholder='请输入新密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                        onChangeText={(newPass) => this.setState({ newPass })}
                        value={this.state.newPass}
                    />
                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 10 }}>确认密码:</Text>
                    <TextInput
                        style={{ width: width - 120, height: 36, backgroundColor: 'white' }}
                        placeholder='请确认密码' placeholderTextColor='#999999' underlineColorAndroid='transparent' secureTextEntry={true} maxLength={18}
                        onChangeText={(okPass) => this.setState({ okPass })}
                        value={this.state.okPass}
                    />
                </View>
            </View>
        }

    }
    render() {
        let self = this;
        var menuLists = this.state.menuList;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='账户设置' leftIcon={BACKICON} finishIcon={require('../img/btn_title_save.png')} imgWidth={39} imgHeight={30} />
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEDEDE', justifyContent: 'center' }}>


                    {
                        menuLists.map((item, i) => this.renderMenuseItem(item, i))
                    }
                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <ScrollView>
                    {this._renderInfo()}
                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#dedede',
        flex: 1
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    backTextWhite: {
        color: '#FFF',
        textAlign: 'center'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 130,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 60,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: 130,
        marginTop: 1,

    },
    controls: {
        alignItems: 'center',
        marginBottom: 30
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
    top_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontSize: 14,
    }, top_select_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#ff9602',
        fontSize: 14,
    }, main_bg: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'space-between',


    }, leftSelectBtn: {
        width: width / 2 - 2,
        backgroundColor: '#dedede',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 30,



    }, leftUnSelectBtn: {
        width: width / 2 - 5,
        backgroundColor: '#dedede',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 30,


    }, rightSelectBtn: {
        width: width / 2 - 5,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'



    }, rightUnSelectBtn: {
        width: width / 2 - 5,
        height: 40,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'


    }, normalselectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: '#009C18',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'



    }
    , normalBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'




    }, normaloneBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'
    }, select_txt: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#00B11D',
        width: width / 2,
        textAlign: 'center',

    }, unselect_txt: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#666666',
        width: width / 2,
        textAlign: 'center',



    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 13,
        color: '#000000',
        marginTop: 5
    }, rule_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 12,
        color: '#999999',
        marginTop: 2
    }, news_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    },

});
