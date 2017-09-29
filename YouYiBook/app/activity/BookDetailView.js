import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Image,
    Platform
} from 'react-native';

var { height, width } = Dimensions.get('window');
const BACKICON = require('../img/btn_titel_back.png');
const TITLELOG = require('../img/title_logo.png');
const FAVORITEICON = require('../img/btn_title_favorite.png');
const SHAREICON = require('../img/btn_title_share.png');
import CustomBtn from '../view/CustomButton';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/bookInfo';
const FAVORITESURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/change_favorite';
var menus = ['电子书', '纸质书'];
import { CachedImage } from "react-native-img-cache";
const HIDDENICON = require('../img/book_detail_intro_close.png');
const SHOWICON = require('../img/book_detail_intro_open.png');
const MOREICON = require('../img/bookstore_lead_sign.png');
const BOTTOMICON = require('../img/tab_menu_selected.png');
const LABLENOICON = require('../img/null_image.png');
import { toastShort } from '../utils/ToastUtil';
var bookIds;
import Global from '../utils/global';
import DeviceStorage from '../utils/deviceStorage';
import RNFS from 'react-native-fs';
export default class BookDetail extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            bookId: '',
            show: false,
            menuList: [],
            detailEntity: {},
            elePage: true,
            showIcon: false,
            showLine: 3,
            showEleBook: false,
            showPaperBook: false
        };

    }
    getData(bookId) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('book_id=' + bookId);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    componentDidMount() {

        bookIds = this.props.navigation.state.params.book_id;
        this.getData(bookIds);
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
            obj.type = this.state.detailEntity.type;
            topMenu.push(obj);

        }
        this.setState({

            menuList: topMenu
        })


    }
    _menuClickListener(item, j) {
        if (j == 0) {

            if (item.type == '0' || item.type == '2') {

                var menu_list = this.state.menuList;
                for (var i = 0; i < menu_list.length; i++) {
                    menu_list[i].select = false;

                }
                menu_list[j].select = true;
                var flag = j == 0 ? true : false;
                this.setState({
                    menuList: menu_list,
                    elePage: flag

                })

            }
        } else {
            if (item.type == '1' || item.type == '2') {

                var menu_list = this.state.menuList;
                for (var i = 0; i < menu_list.length; i++) {
                    menu_list[i].select = false;

                }
                menu_list[j].select = true;
                var flag = j == 0 ? true : false;
                this.setState({
                    menuList: menu_list,
                    elePage: flag

                })

            }

        }



    }
    _downLoadMethord(item) {
        var that = this;
        that.setState({
            show: true,
        });
        var DownloadFileOptions = {
            fromUrl: item.freeread_url,          // URL to download file from
            toFile: RNFS.DocumentDirectoryPath + '/' + item.book_id + '.pdf', // Local filesystem path to save the file to
            begin: function (val) {
                toastShort('开始下载');
            },
            progress: function (val) {
                tempLength = parseInt(val.bytesWritten);
                totalSize = parseInt(val.contentLength);
                percents = (tempLength / totalSize).toFixed(2);
                if ((percents * 100) > 99) {
                    that.setState({
                        show: false
                    });
                    var obj = new Object();
                    obj.isDownLoad = true;
                    toastShort('下载完成');
                    const { navigate } = that.props.navigation;
                    navigate('PdfReadView', {
                        book_id: item.book_id
                    });
                    DeviceStorage.save(item.book_id + '.pdf', obj);
                }
            },
        }
        var result = RNFS.downloadFile(DownloadFileOptions);
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
                <View style={{ height: 38, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
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
                <View style={{ height: 38, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
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
    goCommentActivity() {

        const { navigate } = this.props.navigation;
        navigate('BookCommentView', {
            book_id: this.state.detailEntity.book_id
        });


    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.setState({
                    detailEntity: responseData,
                    show: false

                })
                that.initMenu();

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    getFavoritesData(bookId, operation) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('user_id=' + Global.userName);
        StringBufferUtils.append('&&book_id=' + bookId);
        StringBufferUtils.append('&&type=' + 'android');
        StringBufferUtils.append('&&operation=' + operation);
        let params = StringBufferUtils.toString();
        this.fetchFavoritesData(params, operation);
    }
    // 数据请求
    fetchFavoritesData(params, operation) {
        var that = this;
        console.log(FAVORITESURL + params);
        NetUitl.post(FAVORITESURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                if ('0' == operation) {

                    toastShort('收藏成功');
                } else {
                    toastShort('取消收藏成功');
                }
                that.setState({
                    show: false

                })

            } else {
                if (null != responseData && responseData.return_code == '1') {

                    if ('0' == operation) {

                        toastShort('该书已加入收藏夹！');
                    } else {
                        toastShort('取消收藏失败');
                    }

                } else if (null != responseData && responseData.return_code == '400') {

                    const { navigate } = this.props.navigation;
                    navigate('LoginView', {
                    });

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
    favoriteOnlcik() {
        if (Global.isLogin != null && Global.isLogin != undefined && Global.isLogin == true) {

            this.getFavoritesData(bookIds, '0');
        } else {
            const { navigate } = this.props.navigation;
            navigate('LoginView', {
            });

        }


    }
    shareOnlcik() {
        alert('shareOnlcik');

    }
    onClick(flag, item) {
        switch (flag) {
            case '0'://电子书价格
                this._addBookInShelf();
                break;
            case '1'://电子书阅读
                this._readerBook(item);
                break;
            case '2'://纸质书价格
                toastShort('支付功能暂未开放');
                break;
            case '3'://加入购物车
                this._addGoodsCart();

                break;
            case '4'://纸质书阅读
                this._readerBook(item);
                break;
        }

    }

    _readerBook(item) {
        var that = this;
        DeviceStorage.get(item.book_id + '.pdf', function (jsonValue) {
            if (jsonValue != null) {

                var isDownLoad = jsonValue.isDownLoad;
                if (!isDownLoad) {
                    that._downLoadMethord(item);
                } else {
                    const { navigate } = that.props.navigation;
                    navigate('PdfReadView', {
                        book_id: item.book_id
                    });

                }
            } else {
                that._downLoadMethord(item);

            }



        });

    }

    /**
     * 免费图书加入书架
     */
    _addBookInShelf() {

        var bookEntity = this.state.detailEntity;
        var isAdd = false;
        var that = this;
        if (null != bookEntity && bookEntity.isfree == '1') {
            DeviceStorage.get(bookEntity.book_id, function (jsonValue) {
                console.log('jsonValue=' + jsonValue);
                if (jsonValue != null) {

                    isAdd = jsonValue.isAdd;
                    if (!isAdd) {
                        that._getBookInfo(bookEntity);
                    } else {

                        toastShort('已经加入书架了！');
                    }
                } else {
                    that._getBookInfo(bookEntity);

                }



            });

        } else {

            const { navigate } = this.props.navigation;
            navigate('CountCenterView', {
                bookInfos: bookEntity,

            });

        }

    }


    /**
    * 加入购物车
    */
    _addGoodsCart() {

        var bookEntity = this.state.detailEntity;
        var isAdd = false;
        var that = this;
        if (null != bookEntity) {
            DeviceStorage.get('goodscart_' + bookEntity.book_id, function (jsonValue) {
                console.log('jsonValue=' + jsonValue);
                if (jsonValue != null) {

                    isAdd = jsonValue.isAdd;
                    if (!isAdd) {
                        that._getBookGoodsList(bookEntity);
                    } else {

                        toastShort('已加入购物车！');
                    }
                } else {
                    that._getBookGoodsList(bookEntity);

                }



            });

        }

    }
    _getBookInfo(books) {

        var bookList = [];
        var obj = new Object();
        obj.isAdd = true;
        DeviceStorage.get('book_shelf_key', function (jsonValue) {
            if (null != jsonValue) {
                bookList = jsonValue;
                console.log(jsonValue);
                bookList.push(books);
                DeviceStorage.save('book_shelf_key', bookList);
                DeviceStorage.save(books.book_id, obj);
            } else {
                bookList.push(books);
                DeviceStorage.save('book_shelf_key', bookList);
                DeviceStorage.save(books.book_id, obj);
            }
            toastShort('加入书架成功！');

        });
    }

    _getBookGoodsList(books) {

        var bookList = [];
        var obj = new Object();
        obj.isAdd = true;
        DeviceStorage.get('book_goodscart_key', function (jsonValue) {
            if (null != jsonValue) {
                bookList = jsonValue;
                console.log(jsonValue);
                bookList.push(books);
                DeviceStorage.save('book_goodscart_key', bookList);
                DeviceStorage.save('goodscart_' + books.book_id, obj);
            } else {
                bookList.push(books);
                DeviceStorage.save('book_goodscart_key', bookList);
                DeviceStorage.save('goodscart_' + books.book_id, obj);
            }
            toastShort('加入购物车成功！');

        });
    }
    // 返回国内法规Item
    _renderBook = (detail) => {
        return (
            <View style={{ height: 170, justifyContent: 'center', backgroundColor: '#DEDEDE' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CachedImage style={{ height: 100, width: 80, marginLeft: 10 }} source={{ uri: detail.book_icon }} />
                    <View style={{ height: 160, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={styles.news_item_title} numberOfLines={2}>{detail.book_name}</Text>
                        <Text style={styles.rule_item_time}>作者:{detail.book_author}</Text>
                        <Text style={styles.rule_item_time}>分类:{(detail.classify_name == '' || detail.classify_name == undefined) ? '未知' : detail.classify_name}</Text>
                        <Text style={styles.rule_item_time}>字数:{detail.text_count}字</Text>
                        {this._renderItem(detail)}
                        <Text style={styles.rule_item_time}>出版社:{detail.publisher_name}</Text>
                        <Text style={styles.rule_item_time}>时间:{detail.press_datetime}</Text>
                        <Text style={styles.rule_item_time}>ISBN号:{detail.ISBN}</Text>
                    </View>

                </View>
            </View>
        );
    }
    _renderItem(detail) {

        if (this.state.elePage == true) {

            return <Text style={styles.rule_item_time}>大小:{(detail.size == '' || detail.size == undefined) ? '未知' : detail.size}</Text>
        }
    }

    _renderButton(detail) {
        var elePrice = '¥:' + detail.e_price;
        var paperPrice = '¥:' + detail.p_price;

        if (this.state.elePage) {

            return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#DEDEDE', }}>

                <CustomBtn textColor='white' textSize={14} btnTxt={elePrice} _BtnOnlcik={() => this.onClick('0', detail)} bgColor='#EBAA00' btnWidth={80} btnHeight={30} />
                <CustomBtn textColor='white' textSize={14} btnTxt='免费试读' _BtnOnlcik={() => this.onClick('1', detail)} bgColor='#25BE00' btnWidth={80} btnHeight={30} />

            </View>

        } else {

            return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#DEDEDE', }}>

                <CustomBtn textColor='white' textSize={14} btnTxt={paperPrice} _BtnOnlcik={() => this.onClick('2', detail)} bgColor='#C5C5C5' btnWidth={80} btnHeight={30} />
                <CustomBtn textColor='white' textSize={14} btnTxt='加入购物车' _BtnOnlcik={() => this.onClick('3', detail)} bgColor='#DF4A0C' btnWidth={80} btnHeight={30} />
                <CustomBtn textColor='white' textSize={14} btnTxt='免费试读' _BtnOnlcik={() => this.onClick('4', detail)} bgColor='#23BD00' btnWidth={80} btnHeight={30} />

            </View>

        }
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2', marginTop: 5 }} />;
    }
    _iconClick() {

        var flag = this.state.showIcon;
        var line = flag == true ? 3 : 30;
        this.setState({
            showIcon: !flag,
            showLine: line


        })


    }
    renderIosBar() {

        if (Platform.OS === 'ios') {

            return <View style={{height: 20, backgroundColor: '#E1E7E3',}}></View>
        }

    }
    render() {
        var menuLists = this.state.menuList;
        // this._renderDevice(this.state.detailEntity);
        return (
            <ScrollView>

                <View state={styles.page}>
                    {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                    <View >
                        <StatusBar
                            animated={true}
                            hidden={false}
                            backgroundColor={'#E1E7E3'}
                            barStyle={'default'}
                            networkActivityIndicatorVisible={true}
                        />
                        {this.renderIosBar()}
                       <View style={styles.container}>

                           <View style={styles.left_view} >

                               <TouchableOpacity onPress={() => this.backOnclik()} >
                                   <Image style={styles.left_icon} source={BACKICON}></Image>
                               </TouchableOpacity>
                           </View>
                           <View style={styles.textview}>
                               <Image source={TITLELOG} style={{ height: 32, width: 32 }} />
                               <Text style={styles.textstyle} numberOfLines={1}>书籍详情</Text>
                           </View>
                           <View style={{
                               flexDirection: 'row', justifyContent: 'flex-end',
                               alignItems: 'center', flex: 1
                           }}>


                               <View style={styles.right_view} >
                                   <TouchableOpacity onPress={() => this.favoriteOnlcik()} >

                                       <Image style={styles.right_icon} source={FAVORITEICON}></Image>

                                   </TouchableOpacity>

                               </View>
                               <View style={styles.right_view} >
                                   <TouchableOpacity onPress={() => this.shareOnlcik()} >

                                       <Image style={styles.right_icon} source={SHAREICON}></Image>

                                   </TouchableOpacity>

                               </View>

                           </View>
                       </View>
                    </View>
                    {/*<View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />*/}
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEDEDE', justifyContent: 'center' }}>


                        {
                            menuLists.map((item, i) => this.renderMenuseItem(item, i))
                        }
                    </View>
                    <View style={{ backgroundColor: '#DEDEDE' }} >
                        {this._renderBook(this.state.detailEntity)}
                        {this._renderButton(this.state.detailEntity)}
                        {this._separator()}
                    </View>
                    <View style={{ backgroundColor: '#DEDEDE', }}>
                        <View style={{ flexDirection: 'row', height: 45, justifyContent: 'space-between', width: width, alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 15, color: '#000000', textAlign: 'center', marginLeft: 10 }}>简介</Text>
                            <TouchableOpacity onPress={() => this._iconClick()} activeOpacity={0.8}>

                                <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>

                                    <Image style={{ height: 12, width: 11, marginRight: 20 }} source={this.state.showIcon == true ? HIDDENICON : SHOWICON} />
                                </View>
                            </TouchableOpacity>

                        </View>
                        <Text numberOfLines={this.state.showLine} style={{ paddingLeft: 5, paddingRight: 5 }}>{this.state.detailEntity.intro}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.goCommentActivity()}>
                            <View style={{ flexDirection: 'row', width: width, height: 45, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }}>

                                <View style={{ flexDirection: 'row', width: 140, alignItems: 'center' }}>

                                    <Text style={{ fontSize: 15, color: '#000000', textAlign: 'center', marginLeft: 10 }}>评论</Text>
                                    <Text style={{ fontSize: 13, color: '#999999', textAlign: 'center', marginLeft: 5 }}>共{this.state.detailEntity.comment_count}条</Text>
                                </View>
                                <View style={{ marginRight: 20 }}>
                                    <Image source={MOREICON} style={{ height: 14, width: 9 }} />
                                </View>

                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height:  45,
        alignSelf: 'stretch',
        backgroundColor: '#E1E7E3',
        justifyContent: 'space-between',
        width: width
    }, page: {
        height: height,
        backgroundColor: '#DEDEDE'


    }, textview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    textstyle: {
        fontSize: 18,
        color: '#1FA82D',
        textAlign: 'center',
        paddingLeft: 10,
    },
    right_view: {
        flexDirection: 'row',
        alignItems: 'center',


    },
    right_icon: {
        width: 39,
        height: 30,
        marginRight: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 30,
        flex: 1,
    },
    left_icon: {
        width: 39,
        height: 30,
        marginLeft: 10,
        justifyContent: 'center'

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
        paddingLeft: 20,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    },
});