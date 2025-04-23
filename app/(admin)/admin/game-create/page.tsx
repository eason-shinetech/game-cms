"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  instructions: z.string(),
  url: z.string().url().min(5),
  thumb: z.string().url().min(5),
  bannerImage: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  category: z.string().min(1),
  tag: z.string(),
  fetchFrom: z.string(),
});

const GameCreate = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      url: "",
      thumb: "",
      bannerImage: "",
      width: 0,
      height: 0,
      category: "",
      tag: "",
      fetchFrom: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="w-full p-8 flex flex-col gap-4">
      <h1 className="mx-auto text-2xl text-slate-600 font-semibold">
        Add a game
      </h1>
      <hr />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-200 mx-auto"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Game Title" {...field} />
                </FormControl>
                <FormDescription>This is your game title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Game Description" {...field} />
                </FormControl>
                <FormDescription>
                  This is your game description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Input placeholder="Game Instructions" {...field} />
                </FormControl>
                <FormDescription>
                  This is your game instructions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder="Game Url" {...field} />
                </FormControl>
                <FormDescription>This is your game url.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumb</FormLabel>
                <FormControl>
                  <Input placeholder="Game Thumb" {...field} />
                </FormControl>
                <FormDescription>This is your game thumb.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <Input placeholder="Game Banner Image" {...field} />
                </FormControl>
                <FormDescription>
                  This is your game bannerImage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input placeholder="800" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input placeholder="600" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="set category" {...field} />
                </FormControl>
                <FormDescription>
                  If there are multiple ones, separate them with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <Input placeholder="set tag" {...field} />
                </FormControl>
                <FormDescription>
                  If there are multiple ones, separate them with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fetchFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monetize">Game Monetize</SelectItem>
                    <SelectItem value="game distribution">
                      Game Distribution
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default GameCreate;
