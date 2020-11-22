import React from "react";
import { Link } from "react-router-dom";
const Index = () => (
  <div class="flex items-center justify-center h-full ">
    <div class="container">
      <div class="bg-white rounded-lg shadow-lg p-5 md:p-20 mx-2">
        <div class="text-center">
          <h2 class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
            This page is coming soon !
          </h2>
          <h3 class="text-xl md:text-3xl mt-10">
            Check lobby page for now :{" "}
            <Link to="/lobby">
              <button class="bg-transparent hover:bg-green-300 text-green-400 font-semibold hover:text-white py-2 px-4 border border-green-400 hover:border-transparent rounded mr-2">
                Go for lobbys !
              </button>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  </div>
);

export { Index };
