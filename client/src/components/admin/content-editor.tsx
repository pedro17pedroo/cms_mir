import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HeroSlide, AboutContent, BibleVerse } from "@shared/schema";

export default function ContentEditor() {
  const { toast } = useToast();
  
  const { data: heroSlides } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
  });

  const { data: aboutContent } = useQuery<AboutContent[]>({
    queryKey: ["/api/about-content"],
  });

  const { data: bibleVerse } = useQuery<BibleVerse>({
    queryKey: ["/api/bible-verse"],
  });

  const [heroForm, setHeroForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    backgroundImage: "",
  });

  const [bibleVerseForm, setBibleVerseForm] = useState({
    verse: bibleVerse?.verse || "",
    reference: bibleVerse?.reference || "",
    backgroundImage: bibleVerse?.backgroundImage || "",
  });

  const updateBibleVerseMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/bible-verse", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bible-verse"] });
      toast({
        title: "Success",
        description: "Bible verse updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bible verse",
        variant: "destructive",
      });
    },
  });

  const createHeroSlideMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/hero-slides", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({
        title: "Success",
        description: "Hero slide created successfully",
      });
      setHeroForm({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        backgroundImage: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create hero slide",
        variant: "destructive",
      });
    },
  });

  const handleBibleVerseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBibleVerseMutation.mutate(bibleVerseForm);
  };

  const handleHeroSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHeroSlideMutation.mutate({
      ...heroForm,
      isActive: true,
      order: (heroSlides?.length || 0) + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
        <p className="text-gray-600">Manage your website content</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="bible">Bible Verse</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Carousel</CardTitle>
              <CardDescription>
                Manage the main hero section of your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleHeroSlideSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      placeholder="Slide title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      value={heroForm.buttonText}
                      onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                      placeholder="Button text"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    placeholder="Slide description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonLink">Button Link</Label>
                    <Input
                      id="buttonLink"
                      value={heroForm.buttonLink}
                      onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                      placeholder="Button link URL"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundImage">Background Image URL</Label>
                    <Input
                      id="backgroundImage"
                      value={heroForm.backgroundImage}
                      onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                      placeholder="Background image URL"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={createHeroSlideMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {createHeroSlideMutation.isPending ? "Creating..." : "Create Hero Slide"}
                </Button>
              </form>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Existing Slides</h4>
                <div className="space-y-2">
                  {heroSlides?.map((slide) => (
                    <div key={slide.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{slide.title}</div>
                      <div className="text-sm text-gray-600">{slide.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Manage the about section content (Vision, Mission, Beliefs)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutContent?.map((content) => (
                  <div key={content.id} className="p-4 border rounded-lg">
                    <div className="font-medium text-lg">{content.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{content.section}</div>
                    <div className="text-gray-700 mt-2">{content.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bible" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bible Verse Section</CardTitle>
              <CardDescription>
                Update the inspirational bible verse displayed on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBibleVerseSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="verse">Bible Verse</Label>
                  <Textarea
                    id="verse"
                    value={bibleVerseForm.verse}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, verse: e.target.value })}
                    placeholder="Enter the bible verse"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={bibleVerseForm.reference}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, reference: e.target.value })}
                    placeholder="e.g., John 3:16"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="verseBackground">Background Image URL</Label>
                  <Input
                    id="verseBackground"
                    value={bibleVerseForm.backgroundImage}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, backgroundImage: e.target.value })}
                    placeholder="Background image URL"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateBibleVerseMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {updateBibleVerseMutation.isPending ? "Updating..." : "Update Bible Verse"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
