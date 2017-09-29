import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
    TouchableOpacity,
    Dimensions,
    InteractionManager
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/ranking_query';
var pageNum = 0;
var isLastPage = false;
var rankType = '1';//1:销售量,2:出版时间,3:收藏,4:关注度
var publisherId = '';
var provinceId = '';
var cityId = '';
const TITLELOG = require('../img/title_logo.png');
const { width, height } = Dimensions.get('window');
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh';
import { CachedImage } from "react-native-img-cache";
var menus = ['销售量', '出版时间', '收藏', '关注度'];
var publisherId = '';
var provinceId = '';
var cityId = '';
var navigate = null;
import Global from '../utils/global';
export default class RankActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoadMore: false,
            dataListViewSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            menuList: []
        }
        this._data = [];
    }
    updateUi(obj) {
        if (undefined != Global.publishId && undefined != Global.provinceId && undefined != Global.cityId) {
            publisherId = Global.publishId;
            provinceId = Global.provinceId;
            cityId = Global.cityId;

        }
        console.log(publisherId, provinceId, cityId);
        pageNum = 0;
        isLastPage = false;
        this._data = [];
        this.getData(rankType);
    }
    componentDidMount() {
        navigate = this.props.navigation;
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法
        if (undefined != Global.publishId && undefined != Global.provinceId && undefined != Global.cityId) {
            publisherId = Global.publishId;
            provinceId = Global.provinceId;
            cityId = Global.cityId;

        }

        this.initMenu();
        this.getData(rankType);
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

    _updateUi() {


    }

    _menuClickListener(item, j) {
        var menu_list = this.state.menuList;
        for (var i = 0; i < menu_list.length; i++) {
            menu_list[i].select = false;

        }
        menu_list[j].select = true;
        this.setState({
            menuList: menu_list,
            show: true

        })
        switch (j) {
            case 0:
                rankType = '1';
                break;
            case 1:
                rankType = '2';
                break;
            case 2:
                rankType = '3';
                break;
            case 3:
                rankType = '4';
                break;

        }



    }
    changeData() {
        pageNum = 0;
        isLastPage = false;
        this._data = [];
        this.getData(rankType);
    }
    renderMenuseItem(item, i) {
        return <View style={{ marginTop: 5, marginBottom: 5 }}>
            <TouchableOpacity onPress={() => this._menuClickListener(item, i)}>
                {this._getSelectText(i, item)}

            </TouchableOpacity>

        </View>;
    }
    _getSelectText(i, item) {
        if (item.select) {

            if (i == 0) {
                return <View style={styles.leftSelectBtn}>

                    <Text style={styles.select_txt} >{item.name}</Text>

                </View>

            } else if (i == 3) {
                return <View style={styles.rightSelectBtn}>
                    <Text style={styles.select_txt}>{item.name}</Text>

                </View>
            } else if (i == 2) {

                return <View style={styles.normalselectBtn}>
                    <Text style={styles.select_txt}>{item.name}</Text>

                </View>
            } else {

                return <View style={styles.normalselectBtn}>
                    <Text style={styles.select_txt}>{item.name}</Text>

                </View>
            }
        } else {


            if (i == 0) {
                return <View style={styles.leftUnSelectBtn}>

                    <Text style={styles.unselect_txt}>{item.name}</Text>
                </View>

            } else if (i == 3) {
                return <View style={styles.rightUnSelectBtn}>
                    <Text style={styles.unselect_txt}>{item.name}</Text>

                </View>
            } else if (i == 2) {

                return <View style={styles.normalBtn}>
                    <Text style={styles.unselect_txt}>{item.name}</Text>

                </View>
            } else {

                return <View style={styles.normaloneBtn}>
                    <Text style={styles.unselect_txt}>{item.name}</Text>

                </View>
            }
        }


    }

    getData(rankType) {
        StringBufferUtils.init();
        StringBufferUtils.append('rank_type=' + rankType);
        StringBufferUtils.append('&&publisher_id=' + publisherId);
        StringBufferUtils.append('&&province=' + provinceId);
        StringBufferUtils.append('&&city=' + cityId);
        StringBufferUtils.append('&&page=' + pageNum);
        StringBufferUtils.append('&&count=' + 10);
        let params = StringBufferUtils.toString();
        this.fetchData(params);

    }
    //判断是否分页
    isLastPageMethord(flag) {
        if (stringUtil.isNotEmpty(flag) && '1' == flag) {

            isLastPage = true;
        } else {

            isLastPage = false;
        }


    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.isLastPageMethord(responseData.is_last_page);
                that.addItemKey(responseData.books);
                pageNum++;


            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    //点击列表点击每一行
    clickItem(item, index) {
        navigate('BookDetailView', {
            book_id: item.book_id
        });

    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 100, justifyContent: 'center', marginTop: 1, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CachedImage style={{ height: 80, width: 60, marginLeft: 10 }} source={{ uri: itemData.book_icon }} />
                        <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={styles.news_item_title} numberOfLines={1}>{itemData.book_name}</Text>
                            <Text style={styles.rule_item_time}>作者:{itemData.book_author}</Text>
                            <Text style={styles.rule_item_time} numberOfLines={1}>出版社:{itemData.publisher_name}</Text>

                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    //整合数据
    addItemKey(rulelist) {
        var that = this;

        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].book_id;

            }

            that._data = that._data.concat(rulelist);
            that.setState({
                dataListViewSource: that.state.dataListViewSource.cloneWithRows(this._data),
                isLoadMore: isLastPage,
                show: false
            });


        }

    }

    /**
     * 下拉刷新
     * @param {*} end 
     */
    _onListRefersh(end) {
        let timer = setTimeout(() => {

            clearTimeout(timer)
            end()//刷新成功后需要调用end结束刷新 不管成功或者失败都应该结束
        }, 500)
    }


    /**
     * 
     * @param {*下拉加载更多} end 
     */
    _onLoadMore(end) {
        this.getData(rankType);
        end(!isLastPage)// 假设加载4页后数据全部加载完毕 加载成功后需要调用end结束刷新  


    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _keyExtractor = (item, index) => item.key;
    render() {
        var menuLists = this.state.menuList;
        return (

            <View style={styles.main_view}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}

                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEDEDE', justifyContent: 'center' }}>


                    {
                        menuLists.map((item, i) => this.renderMenuseItem(item, i))
                    }
                </View>

                <SwRefreshListView
                    dataSource={this.state.dataListViewSource}
                    ref="listView"
                    renderRow={this._renderSearchItem}
                    onRefresh={this._onListRefersh.bind(this)}//设置下拉刷新的方法 传递参数end函数 当刷新操作结束时 */
                    onLoadMore={this._onLoadMore.bind(this)} //设置上拉加载执行的方法 传递参数end函数 
                    isShowLoadMore={this.state.isLoadMore}
                    //可以通过state控制是否显示上拉加载组件，可用于数据不足一屏或者要求数据全部加载完毕时不显示上拉加载控件


                    customRefreshView={(refresStatus, offsetY) => {
                        return null;
                    }}

                    customRefreshViewHeight={0} //自定义刷新视图时必须指定高度*/

                />
            </View>


        );

    }




}
const styles = StyleSheet.create({

    img_item: {
        flex: 1,
        height: 150,
        resizeMode: 'stretch',
        flexDirection: 'column'
    }, page: {
        height: 150,
        backgroundColor: '#f6f6f6'
    }, main_view: {
        flex: 1,
        backgroundColor: '#F0F0F2'


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
        paddingRight: 10,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    }, leftSelectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: '#009C18',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',


    }, leftUnSelectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2'


    }, rightSelectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: '#009C18',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row'



    }, rightUnSelectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
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
        color: 'white'

    }, unselect_txt: {
        fontSize: 14,
        color: '#666666'

    }

});
