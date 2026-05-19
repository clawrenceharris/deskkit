
import { Column, ColumnProps } from "../columns/Column";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { Separator } from "@/components/ui";
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  ChevronRight,
  Calendar,
  Download,
  Heart
} from "lucide-react";
import { useMemo } from "react";
import { getShortDate } from "@/shared/utils/fomatDate";

type DeskHomeViewProps = ColumnProps & {
  desk: DeskForDetail;
}

export function DeskHomeView({ desk, ...props }: DeskHomeViewProps) {
  // Calculate desk statistics
  const stats = useMemo(() => {
    const totalNotebooks = desk.notebooks.length;
    const totalMembers = desk.members.length;
    const totalDownloads = desk.notebooks.reduce((acc, notebook) =>
      acc + notebook.downloads.length, 0
    );
    const totalVotes = desk.notebooks.reduce((acc, notebook) => {
      const upvotes = notebook.votes.filter(v => v.isUpvote).length;
      const downvotes = notebook.votes.filter(v => !v.isUpvote).length;
      return acc + (upvotes - downvotes);
    }, 0);

    return { totalNotebooks, totalMembers, totalDownloads, totalVotes };
  }, [desk]);

  // Get featured content (most recent and popular)
  const featuredContent = useMemo(() => {
    return desk.notebooks
      .sort((a, b) => {
        // Sort by recency and popularity
        const aScore = new Date(a.createdAt).getTime() + (a.votes.filter(v => v.isUpvote).length * 1000);
        const bScore = new Date(b.createdAt).getTime() + (b.votes.filter(v => v.isUpvote).length * 1000);
        return bScore - aScore;
      })
      .slice(0, 3);
  }, [desk.notebooks]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    return desk.notebooks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [desk.notebooks]);

  return (
    <Column
      contentContainerClassName="h-full overflow-y-auto"
      {...props}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {desk.imageUrl && (
              <Avatar className="w-16 h-16">
                <AvatarImage src={desk.imageUrl} alt={desk.name} />
                <AvatarFallback>{desk.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-medium text-foreground">
                Welcome to {desk.name}
              </h1>
              {desk.description && (
                <p className="text-muted-foreground mt-1">{desk.description}</p>
              )}
            </div>
          </div>

          {/* Desk Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalNotebooks}</p>
                  <p className="text-sm text-muted-foreground">Notebooks</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalVotes}</p>
                  <p className="text-sm text-muted-foreground">Votes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Featured Content Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-medium flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Featured Content
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {featuredContent.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredContent.map((notebook) => (
                <Card key={notebook.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">{notebook.title}</CardTitle>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {notebook.materials.length} files
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {notebook.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={notebook.creator.avatarUrl ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {notebook.creator.displayName?.charAt(0) || notebook.creator.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                          {notebook.creator.displayName || notebook.creator.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {notebook.downloads.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {notebook.votes.filter(v => v.isUpvote).length}
                        </span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No content yet</h3>
              <p className="text-muted-foreground text-sm">
                Be the first to share your notes and materials!
              </p>
            </Card>
          )}
        </div>

        <Separator />

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((notebook) => (
                <Card key={notebook.id} className="p-4 cursor-pointer hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={notebook.creator.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {notebook.creator.displayName?.charAt(0) || notebook.creator.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {notebook.creator.displayName || notebook.creator.username}
                        </span>
                        <span className="text-muted-foreground text-xs">shared</span>
                        <Badge variant="outline" className="text-xs">
                          {notebook.materials.length} files
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm line-clamp-1 mb-1">{notebook.title}</h4>
                      <p className="text-muted-foreground text-xs">
                        {getShortDate(new Date(notebook.createdAt))}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No recent activity</h3>
              <p className="text-muted-foreground text-sm">
                Activity will appear here as members share content.
              </p>
            </Card>
          )}
        </div>

        <Separator />

        {/* Quick Navigation Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-medium flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            Quick Navigation
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Browse Notebooks</h3>
                  <p className="text-sm text-muted-foreground">Explore all shared content</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Members</h3>
                  <p className="text-sm text-muted-foreground">See who&apos;s in this desk</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Recent Uploads</h3>
                  <p className="text-sm text-muted-foreground">Latest shared materials</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Popular Content</h3>
                  <p className="text-sm text-muted-foreground">Most downloaded materials</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-medium flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-tertiary" />
            Announcements
          </h2>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-tertiary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Welcome to {desk.name}!</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  This is your collaborative space for sharing notes, materials, and resources.
                  Feel free to explore the content, contribute your own materials, and connect with fellow students.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created by {desk.creator.displayName || desk.creator.username}</span>
                  <span>•</span>
                  <span>{getShortDate(new Date(desk.createdAt))}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Column>
  );
}