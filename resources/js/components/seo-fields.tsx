import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageUpload } from './ui/image-upload';
import { X, Plus, Search, Image, FileText, Tag } from 'lucide-react';

interface SEOFieldsProps {
    seoTitle: string;
    seoDescription: string;
    seoImage: string | File | null;
    seoKeywords: string[];
    onSeoTitleChange: (value: string) => void;
    onSeoDescriptionChange: (value: string) => void;
    onSeoImageChange: (file: File | null, url?: string) => void;
    onSeoKeywordsChange: (keywords: string[]) => void;
    errors?: {
        seo_title?: string[];
        seo_description?: string[];
        seo_image?: string[];
        seo_keywords?: string[];
    };
}

export function SEOFields({
    seoTitle,
    seoDescription,
    seoImage,
    seoKeywords,
    onSeoTitleChange,
    onSeoDescriptionChange,
    onSeoImageChange,
    onSeoKeywordsChange,
    errors = {},
}: SEOFieldsProps) {
    const { t } = useTranslation();
    const [keywordInput, setKeywordInput] = React.useState('');

    const addKeyword = () => {
        if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
            onSeoKeywordsChange([...seoKeywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        onSeoKeywordsChange(seoKeywords.filter(k => k !== keyword));
    };

    const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    return (
        <>
            <div className="flex items-center gap-2 text-lg font-medium">
                <Search className="w-5 h-5" />
                SEO Settings
            </div>
            <p className="text-sm text-muted-foreground py-2">
                Optimize your content for search engines and social media sharing
            </p>
            <div className="space-y-6">
                {/* SEO Title */}
                <div className="space-y-2">
                    <Label htmlFor="seo_title" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        SEO Title
                    </Label>
                    <Input
                        id="seo_title"
                        placeholder="Enter SEO title (recommended: 50-60 characters)"
                        value={seoTitle}
                        onChange={(e) => onSeoTitleChange(e.target.value)}
                        className={errors.seo_title ? 'border-red-500' : ''}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{seoTitle.length}/60 characters</span>
                        {seoTitle.length > 60 && (
                            <span className="text-amber-600">Title may be truncated in search results</span>
                        )}
                    </div>
                    {errors.seo_title && (
                        <p className="text-sm text-red-500">{errors.seo_title[0]}</p>
                    )}
                </div>

                {/* SEO Description */}
                <div className="space-y-2">
                    <Label htmlFor="seo_description" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        SEO Description
                    </Label>
                    <Textarea
                        id="seo_description"
                        placeholder="Enter SEO description (recommended: 150-160 characters)"
                        value={seoDescription}
                        onChange={(e) => onSeoDescriptionChange(e.target.value)}
                        rows={3}
                        className={errors.seo_description ? 'border-red-500' : ''}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{seoDescription.length}/160 characters</span>
                        {seoDescription.length > 160 && (
                            <span className="text-amber-600">Description may be truncated in search results</span>
                        )}
                    </div>
                    {errors.seo_description && (
                        <p className="text-sm text-red-500">{errors.seo_description[0]}</p>
                    )}
                </div>

                {/* SEO Image */}
                <ImageUpload
                    label="SEO Image"
                    value={seoImage}
                    onChange={onSeoImageChange}
                    error={errors.seo_image?.[0]}
                    maxSize={5}
                    accept="image/*"
                    allowUrl={true}
                />

                {/* SEO Keywords */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        SEO Keywords
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter keyword and press Enter"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyPress={handleKeywordKeyPress}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addKeyword}
                            disabled={!keywordInput.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    {seoKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {seoKeywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {keyword}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 hover:bg-transparent"
                                        onClick={() => removeKeyword(keyword)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Add relevant keywords to help search engines understand your content
                    </p>
                    {errors.seo_keywords && (
                        <p className="text-sm text-red-500">{errors.seo_keywords[0]}</p>
                    )}
                </div>
            </div>
        </>
    );
}