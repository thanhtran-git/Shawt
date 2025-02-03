import { ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlFormProps {
  formData: { longUrl: string };
  setFormData: React.Dispatch<React.SetStateAction<{ longUrl: string }>>;
  handleSubmit: (e: FormEvent) => void;
}

const UrlForm = ({ formData, setFormData, handleSubmit }: UrlFormProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ longUrl: e.target.value });
  };

  return (
    <section className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="url"
          value={formData.longUrl}
          onChange={handleInputChange}
          placeholder="Enter your URL in the format http(s)://example.com"
          className="flex-grow text-blue-500"
          required
        />
        <Button type="submit" className="w-full sm:w-auto">
          Shawt it!
        </Button>
      </form>
    </section>
  );
};

export default UrlForm;
