"use client"

/**
 * MobileModal - A responsive modal component
 * - Desktop: Centered dialog
 * - Mobile: Full-screen sheet sliding from bottom
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const MobileModal = DialogPrimitive.Root

const MobileModalTrigger = DialogPrimitive.Trigger

const MobileModalPortal = DialogPrimitive.Portal

const MobileModalClose = DialogPrimitive.Close

const MobileModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
			"data-[state=open]:animate-in data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className
		)}
		{...props}
	/>
))
MobileModalOverlay.displayName = "MobileModalOverlay"

const MobileModalContent = React.forwardRef(
	({ className, children, isDark, showCloseButton = true, ...props }, ref) => (
		<MobileModalPortal>
			<MobileModalOverlay />
			<DialogPrimitive.Content
				ref={ref}
				className={cn(
					// Base styles
					"fixed z-50 flex flex-col",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",

					// Mobile: Full screen from bottom
					"inset-0 rounded-none",
					"data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
					"data-[state=closed]:duration-300 data-[state=open]:duration-400",

					// Desktop: Centered dialog
					"sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
					"sm:max-w-lg sm:w-[95vw] sm:max-h-[90vh] sm:rounded-2xl",
					"sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
					"sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]",
					"sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]",

					// Theme
					isDark
						? "bg-slate-900 border-violet-500/30"
						: "bg-white border-slate-200",
					"sm:border-2 sm:shadow-2xl",

					className
				)}
				{...props}
			>
				{/* Mobile drag indicator */}
				<div className="sm:hidden flex justify-center pt-3 pb-1">
					<div className={cn(
						"w-12 h-1.5 rounded-full",
						isDark ? "bg-slate-700" : "bg-slate-300"
					)} />
				</div>

				{/* Close button */}
				{showCloseButton && (
					<DialogPrimitive.Close
						className={cn(
							"absolute right-4 top-4 z-10 p-2 rounded-xl transition-all duration-200",
							"hover:rotate-90 hover:scale-110",
							isDark
								? "text-violet-400 hover:bg-violet-500/20"
								: "text-violet-600 hover:bg-violet-500/10",
							"sm:top-4 sm:right-4"
						)}
					>
						<X className="h-6 w-6" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}

				{/* Content wrapper with scroll */}
				<div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
					{children}
				</div>
			</DialogPrimitive.Content>
		</MobileModalPortal>
	)
)
MobileModalContent.displayName = "MobileModalContent"

const MobileModalHeader = ({ className, ...props }) => (
	<div
		className={cn(
			"pt-4 pb-4 sm:pt-6",
			className
		)}
		{...props}
	/>
)
MobileModalHeader.displayName = "MobileModalHeader"

const MobileModalTitle = React.forwardRef(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"text-xl font-bold",
			className
		)}
		{...props}
	/>
))
MobileModalTitle.displayName = "MobileModalTitle"

const MobileModalDescription = React.forwardRef(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground mt-2", className)}
		{...props}
	/>
))
MobileModalDescription.displayName = "MobileModalDescription"

const MobileModalFooter = ({ className, ...props }) => (
	<div
		className={cn(
			"pt-6 pb-4 sm:pb-0",
			"flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
			className
		)}
		{...props}
	/>
)
MobileModalFooter.displayName = "MobileModalFooter"

export {
	MobileModal,
	MobileModalPortal,
	MobileModalOverlay,
	MobileModalTrigger,
	MobileModalClose,
	MobileModalContent,
	MobileModalHeader,
	MobileModalFooter,
	MobileModalTitle,
	MobileModalDescription,
}
