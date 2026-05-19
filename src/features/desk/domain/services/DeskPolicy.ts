export interface DeskPolicy {
     /**
     * Whether the user can preview the resource
     * @returns True if the user can preview the resource
     */
    canPreview(): boolean;
    /**
     * Whether the user can view the resource
     * @returns True if the user can view the resource
     */
    canView(): boolean;
    /**
     * Whether the user can post new content to the resource
    * @returns True if the user can post new content to the resource
    */
    canPost(): boolean;
    /**
     * Whether the user can delete the resource
     * @returns True if the user can delete the resource
     */
    canDelete(): boolean;
    /**
     * Whether the user can update the resource
     * @returns True if the user can update the resource
     */
    canUpdate(): boolean;
}