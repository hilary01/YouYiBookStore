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
    Dimensions

} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';
var { height, width } = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';
var BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/query_favorite';
const FAVORITESURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/change_favorite';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
import { CachedImage } from "react-native-img-cache";
import { toastShort } from '../utils/ToastUtil';
import PublicTitle from '../activity/book_public_title';
const BACKICON = require('../img/btn_titel_back.png');
export default class BookFavoriteActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
        this._data = [];
    }

    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        this._data = [];
    }

    getData() {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('user_id=' + Global.userName);
        StringBufferUtils.append('&&page=' + '0');
        StringBufferUtils.append('&&count=' + 100);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            console.log(responseData);
            if (null != responseData && responseData.return_code == '0') {
                that.addItemKey(responseData.books);
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
                dataSource: that.state.dataSource.cloneWithRows(that._data),
                show: false
            });


        } else {
            that.setState({
                show: false,
            });
        }


    }
    deleteRow(data, rowId) {
        var that = this;
        this.setState({
            show: true

        })
        that.getFavoritesData(data.book_id, '2', rowId);
    }

    /**
     * 删除版权
     * @param {*} id 
     */
    deleteMethord(id, rowId) {
        var list = this._data;
        //移除列表中下标为index的项
        delete list[rowId];
        //更新列表的状态
        this._data = list;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            show: false
        });
        toastShort('删除成功！');

    }
    getFavoritesData(bookId, operation, rowId) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('user_id=' + Global.userName);
        StringBufferUtils.append('&&book_id=' + bookId);
        StringBufferUtils.append('&&type=' + 'android');
        StringBufferUtils.append('&&operation=' + operation);
        let params = StringBufferUtils.toString();
        this.fetchFavoritesData(params, operation, bookId, rowId);
    }
    // 数据请求
    fetchFavoritesData(params, operation, book_id, rowId) {
        var that = this;
        console.log(FAVORITESURL + params);
        NetUitl.post(FAVORITESURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.deleteMethord(book_id, rowId);
                that.setState({
                    show: false

                })

            } else {
                if (null != responseData && responseData.return_code == '400') {

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
    //点击列表点击每一行
    clickItem(item) {
        const { navigate } = this.props.navigation;
        navigate('BookDetailView', {
            book_id: item.book_id
        });
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }

    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 100, justifyContent: 'center', marginTop: 1, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width, alignItems: 'flex-end' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CachedImage style={{ height: 80, width: 60, marginLeft: 10 }} source={{ uri: itemData.book_icon }} />
                            <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
                                <Text style={{marginRight:85}} numberOfLines={2}>{itemData.book_name}</Text>
                                <Text style={{marginRight:85}}>作者:{itemData.book_author}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:85 }}>

                                    <Text style={{ color: '#999999', paddingLeft: 20, }}>价格:</Text>
                                    <Text style={{ color: '#00B11D' }}>¥{itemData.e_price}</Text>
                                    <Text style={{ color: '#999999' }}>(电)</Text>
                                    <Text style={{ color: '#00B11D', paddingLeft: 10, }}>¥{itemData.p_price}</Text>
                                    <Text style={{ color: '#999999' }}>(纸)</Text>
                                </View>

                                <Text style={{marginRight:85}} numberOfLines={1}>{itemData.intro}</Text>

                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    //此函数用于为给定的item生成一个不重复的key
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _keyExtractor = (item, index) => item.key;
    finishOnlcik = () => {

    }
    render() {
        let self = this;
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
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='我的收藏' finishIcon={null} leftIcon={BACKICON} />
                <SwipeListView
                    dataSource={this.state.dataSource}
                    renderRow={(data, secId, rowId, rowMap) => (
                        <SwipeRow
                            disableLeftSwipe={false}
                            disableRightSwipe={true}
                            leftOpenValue={0}
                            rightOpenValue={-80}
                        >
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(data, rowId)}>
                                    <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            {this._renderSearchItem(data)}
                        </SwipeRow>
                    )}
                />


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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
        height: 100,
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
        height: 100,
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
    }
});
