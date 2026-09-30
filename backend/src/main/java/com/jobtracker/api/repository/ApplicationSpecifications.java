package com.jobtracker.api.repository;

import org.springframework.data.jpa.domain.Specification;

import com.jobtracker.api.model.ApplicationStatus;
import com.jobtracker.api.model.JobApplication;
import com.jobtracker.api.model.User;

public class ApplicationSpecifications {

    public static Specification<JobApplication> hasUser(User user) {
        return (root, query, cb) -> cb.equal(root.get("user"), user);
    }

    public static Specification<JobApplication> hasStatus(ApplicationStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    /*
        public static Specification<JobApplication> hasCompany(String company) {
            return (root, query, cb) -> cb.equal(root.get("company"), company);
        }

        public static Specification<JobApplication> hasRoleTitle(String roleTitle) {
            return (root, query, cb) -> cb.equal(root.get("roleTitle"), roleTitle);
        }

        public static Specification<JobApplication> hasSalaryRange(String salaryRange) {
            return (root, query, cb) -> cb.equal(root.get("salaryRange"), salaryRange);
        }

        public static Specification<JobApplication> hasLocation(String location) {
            return (root, query, cb) -> cb.equal(root.get("location"), location);
        }
    */
}