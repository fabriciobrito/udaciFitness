import React, { Component } from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper'

export default class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((prevState) => {
      const count = prevState[metric] + step;
      return {
        ...prevState,
        [metric] : count > max ? max : count
      }
    })
  };
  decrement = (metric) => {
    this.setState((prevState) => {
      const count = prevState[metric] - getMetricMetaInfo(metric).step;
      return {
        ...prevState,
        [metric] : count < 0 ? 0 : count
      }
    })
  };
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    return(
      <View>
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => {this.slide(key, value)}}
                    {...rest}
                  />
                : <UdaciStepper
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}
      </View>
    )
  }
}