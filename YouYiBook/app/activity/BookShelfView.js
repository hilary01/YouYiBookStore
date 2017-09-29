import React, {Component} from 'react';
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
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';

var {height, width} = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';

var BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/query_bookshelf';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
// var RETURN_ICON = require('./images/tabs/icon_return.png');
import DeviceStorage from '../utils/deviceStorage';
import {CachedImage} from "react-native-img-cache";
import {toastShort} from '../utils/ToastUtil';
import RNFS from 'react-native-fs';
import PercentageCircle from 'react-native-percentage-circle';

var navigate = null;
export default class BookShelfActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            isPdfDownload: false,
            pageCount: 1,
            percent: 0,
            percentShow: false,
            userName: '',

        };
        this._data = [];
    }

    componentDidMount() {
        var that = this;


            DeviceStorage.get('user_info_key', function (jsonValue) {
                // console.log(jsonValue);
                if (null != jsonValue) {

                    that.setState({
                        userName: jsonValue.userName,

                    })

                }


            });

        navigate = this.props.navigation;
        this.getBookShelfList();
    }

    componentWillUnmount() {
        this._data = [];
    }

    getData() {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('user_id=' + this.state.userName);
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
            if (null != responseData && responseData.return_code == '0') {
                // toastShort(responseData.books);
                if (null != responseData.books && responseData.books.length > 0) {
                    toastShort('为您找回' + responseData.books.length + '本图书')

                } else {
                    toastShort('为您找回' + 0 + '本图书')
                }
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

    updateShelf() {

        this.getData();


    }

    getBookShelfList() {
        var that = this;


        DeviceStorage.get('book_shelf_key', function (jsonValue) {

            if (null != jsonValue) {
                that.setState({
                    show: true
                });
                that.addItemKey(jsonValue);
            } else {
                console.log('show');
                that.setState({
                    show: false
                });
            }

        });
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
        DeviceStorage.delete(data.book_id, function (result) {

            if (result == '0') {

                that.deleteMethord(data.book_id, rowId);
            } else {

                toastShort('删除失败！');
            }
        });


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
        this._filterData(list);
        toastShort('删除成功！');
    }

    _backOnclick() {
        this.props.navigator.pop(
            {}
        );

    }

    _filterData(list) {

        var tempList = [];
        if (null != list) {

            for (var j = 0; j < list.length; j++) {

                if (null != list[j]) {

                    tempList.push(list[j]);
                }

            }
            DeviceStorage.save('book_shelf_key', tempList);
        }

    }

    //点击列表点击每一行
    clickItem(item) {
        var that = this;


        DeviceStorage.get(item.book_id + '.pdf', function (jsonValue) {
            if (jsonValue != null) {

                var isDownLoad = jsonValue.isDownLoad;
                if (!isDownLoad) {
                    that._downLoadMethord(item);
                } else {

                    navigate('PdfReadView', {
                        book_id: item.book_id
                    });

                }
            } else {
                that._downLoadMethord(item);

            }


        });


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
                toastShort('下载开始');
            },
            progress: function (val) {
                tempLength = parseInt(val.bytesWritten);
                totalSize = parseInt(val.contentLength);
                percents = (tempLength / totalSize).toFixed(2);
                console.log('path=='+(RNFS.DocumentDirectoryPath + '/' + item.book_id + '.pdf'));
                if ((percents * 100) > 99) {
                    that.setState({
                        show: false
                    });
                    var obj = new Object();
                    obj.isDownLoad = true;
                    toastShort('下载完成');
                    navigate('PdfReadView', {
                        book_id: item.book_id
                    });
                    DeviceStorage.save(item.book_id + '.pdf', obj);
                }
            },
        }
        var result = RNFS.downloadFile(DownloadFileOptions);
    }

    _separator = () => {
        return <View style={{height: 1, backgroundColor: '#e2e2e2'}}/>;
    }

    onClickListener(flag, item) {

        switch (flag) {
            case '0'://分享
                break;
            case '1'://评论
                navigate('CommentView', {
                    book_id: item.book_id
                });
                break;

        }

    }


    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{height: 100, justifyContent: 'center', marginTop: 1, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: width,
                        alignItems: 'flex-end'
                    }}>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <CachedImage style={{height: 80, width: 60, marginLeft: 10}}
                                         source={{uri: itemData.book_icon}}/>
                            <View style={{
                                height: 100,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginLeft: 10
                            }}>
                                <Text  numberOfLines={1}>{itemData.book_name}</Text>
                                <Text >作者:{itemData.book_author}</Text>
                                <Text
                                      numberOfLines={1}>出版社:{itemData.publisher_name}</Text>

                            </View>
                        </View>
                        <View style={{
                            width: 80,
                            height: 45,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onClickListener('0', itemData)}>
                                <View style={{width: 24, height: 24, alignItems: 'center'}}>
                                    < Image source={require('../img/books_shelf_share_btn.png')}
                                            style={{height: 18, width: 19}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onClickListener('1', itemData)}>
                                <View style={{width: 24, height: 24, alignItems: 'center', marginLeft: 10,marginRight:5}}>
                                    < Image source={require('../img/books_shelf_comment_btn.png')}
                                            style={{height: 18, width: 19}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item.key;

    render() {
        let self = this;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView/>) : (null)}
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
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
                                                  onPress={_ => this.deleteRow(data, rowId)}>
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
