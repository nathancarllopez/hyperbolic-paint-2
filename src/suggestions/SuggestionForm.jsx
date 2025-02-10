import Form from "react-bootstrap/Form";

export default function SuggestionForm({
  formData,
  setFormData,
  invalidInputs,
}) {
  function handleChange(event) {
    const inputEl = event.nativeEvent.target;
    const { name, value } = inputEl;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  return (
    <Form>
      <Form.Group controlId="type-input">
        <Form.Label>Type</Form.Label>
        <Form.Select
          className={invalidInputs.type ? undefined : "mb-3"}
          onChange={handleChange}
          name="type"
          value={formData.type}  
        >
          <option value={""}> -- </option>
          <option value={"feature"}>New feature</option>
          <option value={"bug"}>Bug report</option>
          <option value={"design"}>Design improvement</option>
          <option value={"other"}>Other</option>
        </Form.Select>
        {
          invalidInputs.type &&
            <Form.Text className="text-danger">
              Please choose a suggestion type.
            </Form.Text>
        }
      </Form.Group>

      {
        formData.type === 'other' &&
          <Form.Group className="mb-3" controlId="otherType-input">
            <Form.Label>
              Other Type
            </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange}
              name="otherType"
              value={formData.otherType}
            />
            {
              invalidInputs.otherType &&
                <Form.Text className="text-danger">
                  Please describe the type of your suggestion.
                </Form.Text>
            }
          </Form.Group>
      }

      <Form.Group controlId="suggestion-input">
        <Form.Label>Suggestion</Form.Label>
        <Form.Control
          as={"textarea"}
          rows={3}
          onChange={handleChange}
          name="suggestion"
          value={formData.suggestion}
        />
        {
          invalidInputs.suggestion &&
            <Form.Text className="text-danger">
              Please describe your suggestion.
            </Form.Text>
        }
      </Form.Group>
    </Form>
  );
}