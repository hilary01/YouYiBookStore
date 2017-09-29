import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import PDFView from 'react-native-pdf-view';
import RNFS from 'react-native-fs';

var {height, width} = Dimensions.get('window');
var count = 1;
var index = 1;
var pdfPath = '';
const BACKICON = require('../img/btn_titel_back.png');
import PublicTitle from '../activity/book_public_title';
import LoadView from '../view/loading';

export default class PdfReadView extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            pageCount: 1,
            pdf_path: '',
            showPdf: false,
            show: false,
        };
        this.pdfView = null;
        // RNFS.DocumentDirectoryPath
    }

    componentDidMount() {
        pdfPath = RNFS.DocumentDirectoryPath + '/' + this.props.navigation.state.params.book_id + '.pdf';

        if (pdfPath != null) {

            this.setState({
                pdf_path: pdfPath,
                showPdf: true,
                show: true

            })
        }

    }

    //3秒之后缩放1.5倍
    zoom(val = 2.0) {
        this.pdfView && setTimeout(() => {
            this.pdfView.setNativeProps({zoom: val});
        }, 3000);
    }

    /**开始拖拽 */
    _onScrollBeginDrag() {
        console.log("开始拖拽");
        //两种清除方式 都是可以的没有区别  
    }

    /**停止拖拽 */
    _onScrollEndDrag() {
        index++;
        if (index > count) {

            index = 1;
        }
        this.setState({
            pageCount: index

        })
        console.log("停止拖拽");

    }

    /**2.手动滑动分页实现 */
    _onAnimationEnd(e) {
        //求出偏移量  
        let offsetX = e.nativeEvent.contentOffset.x;
        //求出当前页数  
        // let pageIndex = Math.floor(offsetX / ScreenWidth);
        //更改状态机  
        // this.setState({ currentPage: pageIndex });
    }

    backOnclik = () => {
        const {goBack} = this.props.navigation;
        goBack();
    }
    finishOnlcik = () => {

    }

    render() {
        var pages = [];
        for (var i = 0; i < this.state.pageCount; i++) {
            pages.push(
                <PDFView ref={(pdf) => {
                    this.pdfView = pdf;
                }}
                         key={"sop" + i}
                         path={this.state.pdf_path}
                         pageNumber={i}
                         style={styles.pdf}/>
            );
        }
        console.log(this.state.showPdf);
        return (

            <View state={styles.page}>
                {/*{this.state.show == true ? (<LoadView/>) : (null)}*/}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()}
                             title='阅读器' finishIcon={null} leftIcon={BACKICON}/>
                <ScrollView style={styles.pdfcontainer}
                            automaticallyAdjustContentInsets={false}
                            showsVerticalScrollIndicator={false}
                            scrollsToTop={true}
                            onMomentumScrollEnd={(e) => {
                                this._onAnimationEnd(e)
                            }}
                    //开始拖拽  
                            onScrollBeginDrag={() => {
                                this._onScrollBeginDrag()
                            }}
                    //结束拖拽  
                            onScrollEndDrag={() => {
                                this._onScrollEndDrag()
                            }}>


                    {Platform.OS==='ios' ?
                        <PDFView ref={(pdf) => {
                            this.pdfView = pdf;
                        }}
                                 key="sop"
                                 path={this.state.pdf_path}
                                 pageNumber={1}
                                 onLoadComplete={(pageCounts) => {
                                     console.log(pageCounts);
                                     count = pageCounts;
                                     this.pdfView.setNativeProps({
                                         zoom: 1.5
                                     });
                                     this.setState({

                                         show: false,
                                         pageCount: pageCounts
                                     })
                                 }}
                                 style={styles.pdf}/> : null}
                    {pages.map((elem, index) => {
                        return elem;
                    })}
                </ScrollView>
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
        width: width,
        height: height,

    }, page: {
        height: height,
        backgroundColor: '#DEDEDE'


    }
});