import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import WeixinTabBar from './view/MainTopTabBar';
import RecomView from './activity/RecommendView';
import SeriesView from './activity/SeriesView';
import RankView from './activity/RankView';
import ClassifyView from './activity/ClassifyView';
export default class MainActivity extends Component {
    static propTypes = {
        changeIcon: React.PropTypes.func.isRequired,
    };// 注意这里有分号
    constructor(props) {
        super(props);
        this.state = {
            tabNames: ['推荐', '系列书籍', '排行', '分类'],
        };
    }

    updateUi(obj, flag) {


        switch (flag) {
            case 1://系列图书
                this.refs.seriesView.updateUi(obj);
                break
            case 2://排行
                this.refs.rankView.updateUi(obj);
                break

        }

    }

    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        return (
            <ScrollableTabView
                renderTabBar={() => <WeixinTabBar tabNames={tabNames} tabIconNames={tabIconNames} />}
                tabBarPosition='top' locked={true}
                onChangeTab={(obj) => {
                    if (obj.i == 1 || obj.i == 2) {

                        this.props.changeIcon(true, obj.i)
                    } else {
                        this.props.changeIcon(false, obj.i)

                    }
                }
                }>

                <RecomView navigation={this.props.navigation} />
                <SeriesView ref='seriesView' navigation={this.props.navigation} />
                <RankView ref='rankView' navigation={this.props.navigation} />
                <ClassifyView navigation={this.props.navigation} />
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
        flex: 1
    }
});