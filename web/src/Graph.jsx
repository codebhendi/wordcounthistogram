import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-google-charts';

// component to render bar graphs to show word count in 100 posts and pages
// props:
// pages: array containing a list of pages
// posts: array containing a list pf posts
const Graph = ({ pages, posts, barWidth }) => {
  // state to store page's word count graph data
  const [pageGraphData, setPageGraphData] = useState();
  // state to store post's word count graph data
  const [postGraphData, setPostGraphData] = useState();

  // function user to generate graph data for both post and page data.
  // data: dataset which is to be converted so that information can be shown on google charts.
  // seedValue: value at which we are creating out buckets of word count
  // func: function to be used to set the state value to render graphs
  // string; string to be displayed in the tooltip
  const processData = (data, seedValue, func, tooltipString) => {
    // we will obtain all the words from the rendered text which can be obtain in the
    // following path using regex. we get an array of matched elements and then store
    // the length of each array. this will be our word count which we will sort to create our
    // histogram.
    const wordCount = data
      .map((d) => (d.content.rendered.match(/\b\w+\b/g) || []).length)
      .sort((a, b) => a - b);

    // buckets will be used to store the count for each bucket and index of the bucket we are at
    const buckets = [0];
    let index = 0;

    // We wil re-iterate through the word counts and then store it in their respective buckets
    wordCount.forEach((d) => {
      if ((seedValue + seedValue * index) > d) {
        buckets[index] += 1;
      } else {
        index += 1;
        buckets[index] = 1;
      }
    });

    // this array will be used to store the converted graph data where this two values
    // will be our tooltip titles.
    const graphData = [['count', tooltipString]];

    // for each bucket we will add a string to indicate what bucket it is and what value they have.
    buckets.forEach((d, i) => {
      graphData.push([`${seedValue * i}-${seedValue * (i + 1)}`, d]);
    });

    // now we store the data in state
    func(graphData);
  };

  // We use use effect to run our data conversion if any of our two props change
  useEffect(() => {
    // if one of them is empty we will not render
    if (!pages || !posts) return;

    // call the graph data process function to crete our graph render data for both datasets
    processData(pages, 100, setPageGraphData, 'Number of Pages');
    processData(posts, 500, setPostGraphData, 'Number of Posts');
  }, [pages, posts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Chart
        width={800}
        height={600}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={pageGraphData}
        style={{ margin: 'auto' }}
        options={{
          hAxis: {
            title: 'Word count',
            slantedText: true,
            slantedTextAngle: 45,
            minValue: 0,
          },
          vAxis: {
            title: 'Number of pages', minValue: 0,
          },
          bar: { groupWidth: `${parseInt(barWidth, 10)}%` },
          animation: {
            duration: 300,
            easing: 'linear',
            startup: true,
          },
        }}
      />
      <Chart
        width={800}
        height={600}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={postGraphData}
        style={{ margin: 'auto' }}
        options={{
          hAxis: {
            title: 'Word count',
            slantedText: true,
            slantedTextAngle: 45,
            minValue: 0,
          },
          vAxis: {
            title: 'Number of posts', minValue: 0,
          },
          bar: { groupWidth: `${parseInt(barWidth, 10)}%` },
          animation: {
            duration: 300,
            easing: 'linear',
            startup: true,
          },
        }}
      />
    </div>
  );
};

Graph.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  barWidth: PropTypes.number.isRequired,
};

Graph.defaultProps = {
  posts: null,
  pages: null,
};

export default Graph;
