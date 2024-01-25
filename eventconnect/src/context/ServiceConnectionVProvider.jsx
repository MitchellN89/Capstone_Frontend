// import {
//   createContext,
//   useContext,
//   useState,
//   useReducer,
//   useEffect,
// } from "react";
// import { apiCall } from "../utilities/apiCall";
// const ServiceConnectionVContext = createContext();

// const reducer = (state, action) => {
//   const { type, payload, error, response, id } = action;

//   switch (type) {
//     case "PROCESSING_REQUEST":
//       return { ...state, isLoading: true, error: null, response: null };
//     case "REQUEST_FAILED":
//       console.err;
//       return {
//         ...state,
//         isLoading: false,
//         error: error,
//         response: null,
//       };
//     case "GET_EVENTS":
//       return {
//         ...state,
//         data: [...payload],
//         isLoading: false,
//         error: null,
//         response: response,
//       };
//     default:
//       return state;
//   }
// };

// export function ServiceConnectionVProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, {
//     data: [],
//     isLoading: false,
//     error: null,
//     response: null,
//   });

//   const [queryParams, setQueryParams] = useState({});

//   const handleQueryParams = (key, value) => {
//     setQueryParams((curState) => {
//       const existingStateClone = { ...curState };
//       if (existingStateClone[key] && !value) {
//         delete existingStateClone[key];
//         return existingStateClone;
//       } else {
//         existingStateClone[key] = value;
//         return existingStateClone;
//       }
//     });
//   };

//   useEffect(() => {
//     let ignore = false;
//     let queryString = "";
//     if (Object.keys(queryParams).length) {
//       queryString += "?";

//       Object.keys(queryParams).forEach((key, index, array) => {
//         queryString += `${key}=${queryParams[key]}`;
//         if (index < array.length - 1) queryString += "&";
//       });

//       for (let param in queryParams) {
//         queryString += `${param}=`;
//       }
//     }

//     dispatch({ type: "PROCESSING_REQUEST" });

//     apiCall(``)
//       .then((result) => {
//         if (!ignore) {
//           dispatch({
//             type: "GET_SERVICE_CONNECTIONS",
//             payload: result.data,
//             response: result.response,
//           });
//         }
//       })
//       .catch((err) => {
//         if (!ignore) {
//           console.error(err);
//           dispatch({ type: "REQUEST_FAILED", error: err });
//         }
//       });

//     return () => {
//       ignore = true;
//     };
//   }, [queryParams]);

//   const actions = {
//     handleQueryParams,
//   };

//   const context = { state, dispatch, actions };

//   return (
//     <ServiceConnectionVContext.Provider value={context}>
//       {children}
//     </ServiceConnectionVContext.Provider>
//   );
// }

// export function useServiceConnectionVContext() {
//   return useContext(ServiceConnectionVContext);
// }
