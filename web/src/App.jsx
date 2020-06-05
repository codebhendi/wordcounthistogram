import React, { useState } from 'react';
import Axios from 'axios';

import Graph from './Graph';

// In App file we have a button and the graph component.
const App = () => {
  // state to control render of graph components
  const [showGraph, setShowGraph] = useState(false);
  // state to store posts and pages
  const [posts, setPosts] = useState();
  const [pages, setPages] = useState();
  const [barWidth, setBarwidth] = useState(30);

  // function to obtain data from axios and the provided api
  const getPostData = async () => {
    try {
      // we will wait for the posts data
      const { data: postData } = await Axios('https://www.vdocipher.com/blog/wp-json/wp/v2/posts?per_page=100');
      // we will wait for the pages data
      const { data: pageData } = await Axios('https://www.vdocipher.com/blog/wp-json/wp/v2/pages?per_page=100');

      // start showing the graph and store the render data in the state.
      setShowGraph(true);
      setPosts(postData);
      setPages(pageData);
    } catch (e) {
      console.log(e);
    }
  };

  // function to handle the click event
  const renderGraphs = (event) => {
    event.preventDefault();
    getPostData();
  };

  // function to handle change in the input field provided by the number input field
  const handleChange = (event) => {
    event.preventDefault();

    const { value } = event.target;

    // check if the value is among the permitted range
    if (value > 100 || value < 0) return;

    setBarwidth(value);
  };

  return (
    <div>
      <button onClick={renderGraphs} type="button">Show graphs</button>
      <br />
      <br />
      <div>Bar Width</div>
      <input type="number" onChange={handleChange} name="barwidth" value={barWidth} />
      {showGraph && <Graph posts={posts} pages={pages} barWidth={barWidth} />}
    </div>
  );
};

export default App;
