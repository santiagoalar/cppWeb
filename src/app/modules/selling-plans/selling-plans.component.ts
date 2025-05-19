import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SellingPlanData } from 'src/app/models/selling-plans-data.model';
import { SellingPlansService } from '../services/selling-plans.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-selling-plans',
  templateUrl: './selling-plans.component.html',
  styleUrls: ['./selling-plans.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SellingPlansComponent implements OnInit {
  plans: SellingPlanData[] = [];
  loading = false;
  userId = '';
  currentPlanIndex = 0;
  createMode = false;
  editMode = false;
  planForm!: FormGroup;
  
  statusOptions = [
    { value: 'pending', translation: 'sellingPlans.statuses.pending' },
    { value: 'in_progress', translation: 'sellingPlans.statuses.in_progress' },
    { value: 'completed', translation: 'sellingPlans.statuses.completed' },
    { value: 'failed', translation: 'sellingPlans.statuses.failed' }
  ];
  
  constructor(
    private sellingPlansService: SellingPlansService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.initForm();
    this.loadSellingPlans();
  }

  initForm(): void {
    this.planForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      target_amount: [0, [Validators.required, Validators.min(1)]],
      target_date: [new Date(), Validators.required],
      status: ['pending']
    });
  }

  loadSellingPlans(): void {
    this.loading = true;
    this.sellingPlansService.getUserSellingPlans(this.userId).subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading selling plans:', error);
        this.loading = false;
        this.showSnackBar('sellingPlans.errorLoadingPlans');
      }
    });
  }

  showSnackBar(messageKey: string): void {
    this.snackBar.open(
      this.translate.instant(messageKey),
      this.translate.instant('common.close'),
      { duration: 3000 }
    );
  }

  nextPlan(): void {
    if (this.plans.length > 0) {
      this.currentPlanIndex = (this.currentPlanIndex + 1) % this.plans.length;
    }
  }

  prevPlan(): void {
    if (this.plans.length > 0) {
      this.currentPlanIndex = (this.currentPlanIndex - 1 + this.plans.length) % this.plans.length;
    }
  }

  goToPlan(index: number): void {
    if (index >= 0 && index < this.plans.length) {
      this.currentPlanIndex = index;
    }
  }

  toggleCreateMode(): void {
    this.createMode = !this.createMode;
    if (this.createMode) {
      this.editMode = false;
      this.planForm.reset({
        status: 'pending',
        target_date: new Date(),
        target_amount: 0
      });
    }
  }

  toggleEditMode(plan?: SellingPlanData): void {
    this.editMode = !this.editMode;
    if (this.editMode && plan) {
      this.createMode = false;
      this.planForm.patchValue({
        title: plan.title,
        description: plan.description,
        target_amount: plan.target_amount,
        target_date: new Date(plan.target_date),
        status: plan.status || 'pending'
      });
    }
  }

  savePlan(): void {
    if (this.planForm.invalid) return;

    const formValue = this.planForm.value;
    const plan: SellingPlanData = {
      user_id: this.userId,
      title: formValue.title,
      description: formValue.description,
      target_amount: formValue.target_amount,
      target_date: formValue.target_date.toISOString(),
      status: formValue.status
    };

    this.loading = true;

    if (this.createMode) {
      this.sellingPlansService.createSellingPlan(plan).subscribe({
        next: () => {
          this.loadSellingPlans();
          this.createMode = false;
          this.showSnackBar('sellingPlans.planCreatedSuccess');
        },
        error: (error) => {
          console.error('Error creating selling plan:', error);
          this.loading = false;
          this.showSnackBar('sellingPlans.errorCreatingPlan');
        }
      });
    } else if (this.editMode) {
      const currentPlan = this.plans[this.currentPlanIndex];
      this.sellingPlansService.updateSellingPlan(currentPlan.id!, plan).subscribe({
        next: () => {
          this.loadSellingPlans();
          this.editMode = false;
          this.showSnackBar('sellingPlans.planUpdatedSuccess');
        },
        error: (error) => {
          console.error('Error updating selling plan:', error);
          this.loading = false;
          this.showSnackBar('sellingPlans.errorUpdatingPlan');
        }
      });
    }
  }

  deletePlan(plan: SellingPlanData): void {
    this.loading = true;
    this.sellingPlansService.deleteSellingPlan(plan.id!).subscribe({
      next: () => {
        this.plans = this.plans.filter(p => p.id !== plan.id);
        if (this.currentPlanIndex >= this.plans.length) {
          this.currentPlanIndex = Math.max(0, this.plans.length - 1);
        }
        this.loading = false;
        this.showSnackBar('sellingPlans.planDeletedSuccess');
      },
      error: (error) => {
        console.error('Error deleting selling plan:', error);
        this.loading = false;
        this.showSnackBar('sellingPlans.errorDeletingPlan');
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.createMode = false;
    this.planForm.reset();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return 'status-pending';
    }
  }
  
  calculateProgress(plan: SellingPlanData): number {
    if (plan.status === 'completed') return 100;
    if (plan.status === 'failed') return 0;
    
    const now = new Date();
    const startDate = plan.created_at ? new Date(plan.created_at) : now;
    const endDate = new Date(plan.target_date);
    
    if (endDate < now) {
      return plan.status === 'in_progress' ? 90 : 0; 
    }
    
    const totalTime = endDate.getTime() - startDate.getTime();
    const elapsedTime = now.getTime() - startDate.getTime();
    
    let progress = Math.round((elapsedTime / totalTime) * 100);
    
    progress = Math.max(0, Math.min(100, progress));
    
    if (plan.status === 'in_progress' && progress < 10) {
      return 10;
    }
    
    return progress;
  }
}