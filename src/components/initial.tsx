import React, {Fragment, useRef, useState} from "react";

export const ReactForm = () => {
  const nameRef = useRef<HTMLInputElement>(null),
    emailRef = useRef<HTMLInputElement>(null),
    passwordRef = useRef<HTMLInputElement>(null),
    searchRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<[]>([]),
    [loading, setLoader] = useState<boolean>(false)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!!nameRef.current?.value || !!emailRef.current?.value || !!passwordRef.current?.value) {
      console.table({
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      })
    }
  };

  const handleReset = (e: any) => {
    e.preventDefault();
    // @ts-ignore
    nameRef.current.value = '';
    // @ts-ignore
    emailRef.current.value = '';
    // @ts-ignore
    passwordRef.current.value = '';
  };

  const handleSearch = async () => {
    setLoader(true);
    const searchQuery = searchRef.current?.value,
      apiKey = process.env.REACT_APP_API_KEY;
    if (!!searchQuery && !!apiKey) {
      const response = await window.fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchQuery}`)
      const obj = await response.json()
      setData(obj.data)
    }
    setLoader(false);
  };

  const debounce = (callback: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(handleSearch, 1000);

  return (
    <div style={{
      position: 'relative'
    }}>
      <div>
        <p>part 1</p>
        <label>
          Name:
          <input placeholder="name" type="text" ref={nameRef}/>
        </label>
        <label>
          Email:
          <input placeholder="email" type="email" ref={emailRef}/>
        </label>


        <label>
          Password:
          <input placeholder="password" type="password" ref={passwordRef}/>
        </label>
        <hr/>
        <button onClick={() => nameRef.current && nameRef.current.focus()}>Focus Name Input</button>
        <button onClick={() => emailRef.current && emailRef.current.focus()}>Focus Email Input</button>
        <button onClick={() => passwordRef.current && passwordRef.current.focus()}>Focus Password Input</button>
        <hr/>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div>
        <hr/>
        <p>part 2</p>
        <label>
          Search:
          <input
            placeholder="search with debounce"
            type="text"
            onChange={debouncedSearch}
            ref={searchRef}
          />
        </label>
      </div>

      {
        loading ? <div style={{
            position: "fixed",
            bottom: 10,
            right: 10,
          }}>Loading...</div>
          : !data.length ? <Fragment/> : <div>
            <h2>Total found: {data.length}, showing {data.slice(0, 16).length}</h2>
            <div style={{
              display: `grid`,
              gridTemplateColumns: `repeat(4, 1fr)`,
              gridTemplateRows: `repeat(4, 1fr)`,
              gridGap: 10,
            }}>
              {data.slice(0, 16).map((d: any) => {
                return (
                  <figure key={d.id} style={{
                    width: `100%`,
                    margin: 0,
                  }}>
                    <img src={d.images.original.url} alt={d.title} style={{width: `100%`}}/>
                    <figcaption>{d.title}</figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
      }
    </div>
  );
}