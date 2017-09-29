/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ViewPagerAndroid,
    ScrollView,
    Navigator,
    View,
    ListView,
    Dimensions,
    WebView,
    ToastAndroid,
    Button,
    DrawerLayoutAndroid,
    StatusBar

} from 'react-native';
import SideMenu from 'react-native-side-menu';
import Menu from '../activity/menu'; //导入菜单组件
import MainPublicTitle from '../activity/book_main_title';
import Global from '../utils/global';

const uri_image_menu = 'http://image18-c.poco.cn/mypoco/myphoto/20160605/09/17351665220160605093956066.png';
const FITERIMG = require('../img/btn_titel_filter.png');
const {width, height} = Dimensions.get('window');
const menuView = null;
import MainActivity from '../main';
import LoginActivity from '../activity/CenterLoginView';
import BookShelfActivity from '../activity/BookShelfView';
import PersonInfoActivity from '../activity/PersonView';
import MoreActivity from '../activity/MoreView';
import RecommendAppActivity from '../activity/RecommendAppView';
import GoodsCartActivity from '../activity/GoodsCartView';

var isFristLoad = true;
const SEARCHIMG = require('../img/btn_titel_search.png');
const OUTLOGINICON = require('../img/btn_logout.png');
const FINDPASSICON = require('../img/btn_title_findpwd.png');
const FINDBOOKICON = require('../img/btn_title_findback.png');
const DELETEICON = require('../img/btn_title_del.png');
const COUNTICON = require('../img/btn_title_payment.png');
export default class SideMenus extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            showFilter: false,
            whichFlag: 1,
            menuIndex: 0,
            rightIcons: SEARCHIMG,
            width: 39,
            height: 30,
            titleName: '游逸书城',
            filterIcon: null,
            showPersonInfo: false,
            showGoodsCartIcon: false,
            filter_Width:0,
            filter_Height:0,
        };
    }

    componentDidMount() {

        if (Global.isLogin == undefined) {
            Global.isLogin = false;
        }
    }


    onMenuItemSelected = (item) => {
        this.setState({
            isOpen: false,

        });
    }

    showToast() {
        // this.refs.toast.show(this.state.selectedItem, 1000);

    }

    showGoodsCartImg(flag) {
        this.setState({

            showGoodsCartIcon: flag
        })

    }

    menuCallBack(menu) {
        var icon;
        Global.menuEntity = menu;
        var width;
        var filterIconImg;
        var filterWidths;
        var filterHights;

        if (Global.isLogin == true && menu.id == 3) {

            icon = OUTLOGINICON;
            width = 39;
            filterIconImg = null;
            filterWidths=0;
            filterHights=0;
        } else if (Global.isLogin == false && menu.id == 3) {
            icon = FINDPASSICON;
            width = 56;
            filterIconImg = null;
            filterWidths=0;
            filterHights=0;
        } else {
            if (menu.id == 0) {
                icon = SEARCHIMG;
                width = 39;
                filterIconImg = null;
                filterWidths=0;
                filterHights=0;

            } else if (menu.id == 4 || menu.id == 5) {

                icon = null;
                width = 0;
                filterIconImg = null;
                filterWidths=0;
                filterHights=0;
            } else if (menu.id == 1) {

                icon = FINDBOOKICON;
                width = 39;
                filterIconImg = null;

            } else if (menu.id == 2) {

                icon = COUNTICON;
                width = 45;
                filterIconImg = DELETEICON;
                filterWidths=39;
                filterHights=30;

            }
        }
        this.setState({
            rightIcons: icon,
            menuIndex: Global.menuEntity.id,
            width: width,
            titleName: menu.name,
            filterIcon: filterIconImg,
            isOpen: false,
            filter_Width:filterWidths,
            filter_Height:filterHights
        })


    }

    onMenuItemOnclik = () => {


        var isOp = this.state.isOpen;
        this.setState({
            isOpen: !isOp,

        });

    }
    fiterOnlcik = () => {
        if (this.state.menuIndex == 0) {

            const {navigate} = this.props.navigation;
            navigate('filterView', {
                // 跳转的时候携带一个参数去下个页面
                callback: (publishId, provinceId, cityId) => {
                    var obj = new Object();
                    obj.pId = publishId;
                    obj.prId = provinceId;
                    obj.cId = cityId;
                    Global.publishId = publishId;
                    Global.provinceId = provinceId;
                    Global.cityId = cityId;
                    this._updateData(obj);
                }
            });
        } else if (this.state.menuIndex == 2) {

            this.refs.goodsCart._deleteBook();

        }
    }
    /**
     *
     * @param {*更新数据} publishId
     * @param {*} provinceId
     * @param {*} cityId
     */
    _updateData = (obj) => {
        var flag = this.state.whichFlag;
        this.refs.mainView.updateUi(obj, flag);
    }
    _changeRightIcon = () => {

        this.setState({
            rightIcons: OUTLOGINICON,
            width: 39
        })
    }

    _changeIndex() {

        this.setState({
            menuIndex: 0
        })
        this.refs.menuV.updateItemIndex();
    }

    fiterIcon = (flag, arg) => {
        var filter = flag == true ? FITERIMG : null;
        var width=(arg==1||arg==2)?39:0;
        var height=(arg==1||arg==2)?30:0;
        this.setState({
            filterIcon: filter,
            showFilter: flag,
            whichFlag: arg,
            isOpen: false,
            filter_Width:width,
            filter_Height:height
        })
    }
    searchOnlcik = () => {

        if (this.state.menuIndex == 0) {
            const {navigate} = this.props.navigation;
            navigate('searchView');


        } else if (this.state.menuIndex == 3 && Global.isLogin == true) {
            Global.isLogin = false;
            this.setState({
                rightIcons: FINDPASSICON,
                width: 56,
                showPersonInfo: false,

            })

        } else if (this.state.menuIndex == 3 && Global.isLogin == false) {
            const {navigate} = this.props.navigation;
            navigate('FindPassView');

        } else if (this.state.menuIndex == 1) {
            this.refs.bookShelf.updateShelf();
        } else if (this.state.menuIndex == 2) {
            // alert('去结算');
        } else {
            const {navigate} = this.props.navigation;
            navigate('searchView');

        }
    }

    showView() {
        const {navigate} = this.props.navigation;
        switch (this.state.menuIndex) {
            case 0://书城
                return <MainActivity changeIcon={this.fiterIcon.bind(this)} ref='mainView' navigation={navigate}/>
                break
            case 1://书架
                return <BookShelfActivity navigation={navigate} ref='bookShelf'/>
                break
            case 2://购物车
                return <GoodsCartActivity navigation={navigate} addgoodscart={this._changeIndex.bind(this)}
                                          ref='goodsCart'/>
                break
            case 3://个人中心
                if (this.state.showPersonInfo == true) {

                    return <PersonInfoActivity navigation={navigate}/>
                } else {
                    return <LoginActivity _changeRightIcon={this._changeRightIcon.bind(this)}
                                          _changeView={this.changeView.bind(this)}/>
                }
                break
            case 4://游逸天下
                return <RecommendAppActivity/>
                break
            case 5://更多
                return <MoreActivity navigation={navigate}/>
                break
        }

    }

    changeView() {
        this.setState({
            showPersonInfo: true
        })
    }

    render() {
        menuView = <Menu ref='menuV' onItemSelected={this.menuCallBack.bind(this)}/>
        // alert(this.state.isOpen);
        return (
            <SideMenu
                menu={menuView}
                isOpen={this.state.isOpen}
                openMenuOffset={width / 4 * 3}
                /* onChange={(isOpen) => this.updateMenuState(isOpen)} */
            >
                <View style={styles.page}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor={'#F3F3F3'}
                        barStyle={'default'}
                        networkActivityIndicatorVisible={true}
                    />
                    <MainPublicTitle title={this.state.titleName} _menuOnclick={() => this.onMenuItemOnclik()}
                                     _filterIconOnlcik={() => this.fiterOnlcik()}
                                     _searchOnlcik={() => this.searchOnlcik()} filterIcon={this.state.filterIcon}
                                     rightIcon={this.state.rightIcons} width={this.state.width} height={30} filterWidth={this.state.filter_Width} filterHeight={this.state.filter_Height}/>
                    <View style={{height: 1, width: width, backgroundColor: '#00B11D'}}/>
                    {this.showView()}

                </View>
            </SideMenu>
        );

    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    button: {
        position: 'absolute',
        top: 20,
        padding: 10,
    },
    caption: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
