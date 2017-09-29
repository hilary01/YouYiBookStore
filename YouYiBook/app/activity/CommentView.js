import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
var { height, width } = Dimensions.get('window');
const BACKICON = require('../img/btn_titel_back.png');
import PublicTitle from '../activity/book_public_title';
import LoadView from '../view/loading';
const SELECTICON = require('../img/book_star_selected.png');
const UNSELECTICON = require('../img/book_star_unselected.png');
import CustomBtn from '../view/CustomButton';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
import NetUitl from '../utils/netUitl';
import { toastShort } from '../utils/ToastUtil';
import Global from '../utils/global';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/comment_ins';
var bookId = '';
export default class CommentView extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            totalScore: 5, // 总分值  
            currentScore: 3, // 分值 
            content: '',
            show: false,
        };
        // RNFS.DocumentDirectoryPath
    }

    submitBtn() {
        this.setState({
            show: true
        });
        var datatime = '';
        var now = new Date();
        datatime = now.getYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
        StringBufferUtils.init();
        StringBufferUtils.append('book_id=' + bookId);
        StringBufferUtils.append('&&content=' + this.state.content);
        StringBufferUtils.append('&&level=' + this.state.currentScore);
        StringBufferUtils.append('&&user_id=' + Global.userName);
        StringBufferUtils.append('&&datatime=' + datatime);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                toastShort('评论成功！');
                that.finishActivity();
                that.setState({
                    show: false

                })

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    componentDidMount() {
        bookId = this.props.navigation.state.params.book_id;
    }

    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    finishActivity() {

        const { goBack } = this.props.navigation;
        goBack();
    }
    finishOnlcik = () => {

    }
    _renderBody() {
        let images = [];
        for (var i = 1; i <= this.state.totalScore; i++) {
            let currentCount = i;
            images.push(
                <View key={"i" + i}>
                    <TouchableOpacity onPress={(i) => { this._score(currentCount) }}>
                        <Image source={UNSELECTICON} style={{ width: 20, height: 20 }} />
                        {this._renderYellowStart(i)}
                    </TouchableOpacity>
                </View>
            );
        }
        return images;
    }

    _renderYellowStart(count) {
        if (count <= this.state.currentScore) {
            return (
                <Image source={SELECTICON} style={{ width: 20, height: 20, position: 'absolute' }} />
            );
        }
    }

    _score(i) {
        this.setState({
            currentScore: i
        });
        // this.props.selectIndex(i);
    }
    onClick(flag) {
        switch (flag) {
            case '0'://提交
                if (Global.isLogin != null && Global.isLogin != undefined && Global.isLogin == true) {
                    var content=this.state.content;
                    if (!stringUtil.isNotEmpty(content)) {
                        toastShort('请输入评论内容');
                        return;
                    }
                    this.submitBtn();
                } else {
                    const { navigate } = this.props.navigation;
                    navigate('LoginView', {
                    });

                }

                break;
            case '1'://清空
                this.setState({
                    content: ''
                })
                break;
        }

    }
    render() {

        return (
            <View state={styles.page}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='发表评论' finishIcon={null} leftIcon={BACKICON} />
                <TextInput
                    style={{ width: width, height: 80, backgroundColor: 'white', textAlign: 'left' }}
                    placeholder='请输入评论内容' placeholderTextColor='#999999' underlineColorAndroid='transparent' maxLength={200} multiline={true}
                    onChangeText={(content) => this.setState({ content })}
                    value={this.state.content}
                />

                <View style={{ flexDirection: 'row', width: width, height: 20, marginBottom: 6, marginTop: 10 }}>
                    <Text> 平分: </Text>
                    {this._renderBody()}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>

                    <CustomBtn textColor='white' textSize={14} btnTxt='提交' _BtnOnlcik={() => this.onClick('0')} bgColor='#DF4A0C' btnWidth={120} btnHeight={30} />
                    <CustomBtn textColor='white' textSize={14} btnTxt='清空' _BtnOnlcik={() => this.onClick('1')} bgColor='#23BD00' btnWidth={120} btnHeight={30} />

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdfcontainer: {
        height: height,

    },
    pdf: {
        height: height,
        backgroundColor: 'red'
    }, page: {
        height: height,
        backgroundColor: '#DEDEDE'


    }
});