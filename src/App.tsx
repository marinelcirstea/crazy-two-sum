import "./App.css";
//
import { FormEvent, useEffect, useState } from "react";
import { useSums } from "./contexts/sums-context";
import { useToast } from "./contexts/toast-context";
import SumsTable from "./components/sums-table";

function App() {
  const [inputValue, setInputValue] = useState("");
  const { result, total, process, processing, error, setOptions } = useSums();

  // NOTE: the failsafe memory overload is commented(disabled)
  // the only thing that the failsafe does is slow down the loop
  // so that the screen won't freeze
  const [disableFailsafe, setDisableFailsafe] = useState(false);

  const toast = useToast();

  useEffect(() => {
    setOptions({ disableFailsafe });
  }, [disableFailsafe]);

  useEffect(() => {
    if (!error && result[0]) {
      toast.success("Sums processed successfully! :)");
    }

    if (error) toast.error(error);
  }, [error, result]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (processing) return;

    try {
      process(inputValue);
      setInputValue("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  return (
    <div className="App">
      {processing ? <div>Processing...</div> : <div>Write something</div>}

      {/* If the total is bigger than what we set in context, show this */}
      {total !== null && total > result.length && (
        <p>
          Only {result.length} items are shown. Total number of items: {total}
        </p>
      )}

      <form className="App-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          placeholder="[ 0, 1, 2, 3, 4, 5 ]"
          onChange={handleChange}
        />
        <br />
        <br />
        {result[0] && <SumsTable sums={[...result]} />}
        <br />
      </form>

      {/* Options for our processor. Currently only 1 */}
      <div className="options">
        <label htmlFor="disableFailsafe">Disable failsafe</label>
        <input
          type="checkbox"
          name="disableFailsafe"
          id=""
          checked={disableFailsafe}
          onChange={() => setDisableFailsafe(!disableFailsafe)}
        />
      </div>
    </div>
  );
}

export default App;
