type OptionsProps = {
  data: {
    value: string;
    text: string;
  }[];
};

function Options({ data }: OptionsProps) {
  return (
    <>
      {data.map((val) => (
        <option value={val.value}>{val.text}</option>
      ))}
    </>
  );
}

export default Options;
